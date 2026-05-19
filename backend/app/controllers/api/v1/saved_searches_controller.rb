module Api
  module V1
    class SavedSearchesController < ApplicationController
      before_action :authenticate_user!
      before_action :set_saved_search, only: [:destroy]

      def index
        saved_searches = current_user.saved_searches.order(created_at: :desc)
        render json: saved_searches
      end

      def create
        saved_search = current_user.saved_searches.build(saved_search_params)
        saved_search.save!
        render json: saved_search, status: :created
      end

      def destroy
        @saved_search.destroy
        head :no_content
      end

      private

      def set_saved_search
        @saved_search = current_user.saved_searches.find(params[:id])
      end

      def saved_search_params
        params.require(:saved_search).permit(:name, search_params: {})
      end
    end
  end
end
