require 'rails_helper'

RSpec.describe "Api::V1::SavedSearches", type: :request do
  let(:user) { create(:user) }

  describe "GET /api/v1/saved_searches" do
    it "returns user's saved searches" do
      create(:saved_search, user: user, name: "My search")
      headers = auth_headers_for(user)
      get "/api/v1/saved_searches", headers: headers, as: :json
      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.first["name"]).to eq("My search")
    end
  end

  describe "POST /api/v1/saved_searches" do
    it "creates a saved search" do
      headers = auth_headers_for(user)
      post "/api/v1/saved_searches",
        params: { saved_search: { name: "Houses in Sydney", search_params: { property_type: "house", bedrooms: "3" } } },
        headers: headers,
        as: :json
      expect(response).to have_http_status(:created)
      expect(user.saved_searches.count).to eq(1)
    end

    it "returns 422 for duplicate name" do
      create(:saved_search, user: user, name: "My search")
      headers = auth_headers_for(user)
      post "/api/v1/saved_searches",
        params: { saved_search: { name: "My search", search_params: {} } },
        headers: headers,
        as: :json
      expect(response).to have_http_status(:unprocessable_content)
    end
  end

  describe "DELETE /api/v1/saved_searches/:id" do
    it "deletes a saved search" do
      saved_search = create(:saved_search, user: user)
      headers = auth_headers_for(user)
      delete "/api/v1/saved_searches/#{saved_search.id}", headers: headers, as: :json
      expect(response).to have_http_status(:no_content)
    end
  end
end
