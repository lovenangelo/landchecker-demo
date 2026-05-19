module Api
  module V1
    class PropertiesController < ApplicationController
      before_action :set_property, only: [:show, :schedule_price_increase]

      def index
        last_modified = Property.maximum(:updated_at)
        return unless stale?(last_modified: last_modified, public: true)

        cache_key = "properties/index/#{request.query_string}/#{last_modified.to_i}"

        properties_data = Rails.cache.fetch(cache_key, expires_in: 5.minutes) do
          properties = Property
            .by_keyword(params[:query])
            .by_price_range(params[:price_min], params[:price_max])
            .by_bedrooms(params[:bedrooms])
            .by_property_type(params[:property_type])
            .by_status(params[:status])
            .near(params[:lat], params[:lng], params[:radius_km])
            .order(created_at: :desc)
            .page(params[:page])
            .per(params[:per_page] || 25)

          {
            properties: properties.as_json,
            meta: {
              current_page: properties.current_page,
              total_pages: properties.total_pages,
              total_count: properties.total_count,
              per_page: properties.limit_value
            }
          }
        end

        render json: properties_data
      end

      def show
        return unless stale?(@property, public: true)

        render json: @property
      end

      def schedule_price_increase
        return render json: { error: "Only for_sale properties can have a price increase scheduled" }, status: :unprocessable_entity unless @property.status == "for_sale"
        return render json: { error: "Price increase already scheduled" }, status: :conflict if @property.price_increase_at&.future?

        @property.update!(price_increase_at: 3.minutes.from_now)
        PriceIncreaseJob.set(wait: 3.minutes).perform_later(@property.id)
        render json: @property, status: :ok
      end

      private

      def set_property
        @property = Property.find(params[:id])
      end
    end
  end
end
