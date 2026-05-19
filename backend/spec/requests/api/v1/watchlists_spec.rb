require 'rails_helper'

RSpec.describe "Api::V1::Watchlists", type: :request do
  let(:user) { create(:user) }
  let(:property) { create(:property) }

  describe "GET /api/v1/watchlists" do
    context "when authenticated" do
      it "returns watched properties" do
        create(:watchlist, user: user, property: property)
        headers = auth_headers_for(user)
        get "/api/v1/watchlists", headers: headers, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to be_an(Array)
        expect(response.parsed_body.first["id"]).to eq(property.id)
      end
    end

    context "when unauthenticated" do
      it "returns 401" do
        get "/api/v1/watchlists", as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/v1/watchlists" do
    context "when authenticated" do
      it "adds property to watchlist" do
        headers = auth_headers_for(user)
        post "/api/v1/watchlists", params: { property_id: property.id }, headers: headers, as: :json
        expect(response).to have_http_status(:created)
        expect(user.watched_properties).to include(property)
      end

      it "returns 422 for duplicate watchlist entry" do
        create(:watchlist, user: user, property: property)
        headers = auth_headers_for(user)
        post "/api/v1/watchlists", params: { property_id: property.id }, headers: headers, as: :json
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "DELETE /api/v1/watchlists/:id" do
    context "when authenticated" do
      it "removes property from watchlist" do
        create(:watchlist, user: user, property: property)
        headers = auth_headers_for(user)
        delete "/api/v1/watchlists/#{property.id}", headers: headers, as: :json
        expect(response).to have_http_status(:no_content)
        expect(user.watched_properties.reload).not_to include(property)
      end

      it "returns 404 for property not in watchlist" do
        headers = auth_headers_for(user)
        delete "/api/v1/watchlists/#{property.id}", headers: headers, as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
