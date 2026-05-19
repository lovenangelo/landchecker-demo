module Api
  module V1
    class WatchlistsController < ApplicationController
      before_action :authenticate_user!

      def index
        watchlists = current_user.watchlists.includes(:property)
        render json: watchlists.map(&:property)
      end

      def create
        watchlist = current_user.watchlists.build(property_id: params[:property_id])
        watchlist.save!
        render json: { message: "Property added to watchlist", property_id: watchlist.property_id }, status: :created
      end

      def destroy
        watchlist = current_user.watchlists.find_by!(property_id: params[:id])
        watchlist.destroy
        head :no_content
      end
    end
  end
end
