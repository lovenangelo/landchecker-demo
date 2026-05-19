require 'rails_helper'

RSpec.describe "Api::V1::Properties", type: :request do
  let!(:house) { create(:property, property_type: "house", bedrooms: 3, price: 500_000, status: "for_sale") }
  let!(:apartment) { create(:property, property_type: "apartment", bedrooms: 1, price: 300_000, status: "sold") }

  describe "GET /api/v1/properties" do
    it "returns paginated properties" do
      get "/api/v1/properties"
      expect(response).to have_http_status(:ok)
      body = response.parsed_body
      expect(body["properties"]).to be_an(Array)
      expect(body["meta"]).to include("current_page", "total_pages", "total_count")
    end

    it "filters by property_type" do
      get "/api/v1/properties", params: { property_type: "house" }
      expect(response.parsed_body["properties"].map { |p| p["property_type"] }.uniq).to eq(["house"])
    end

    it "filters by bedrooms" do
      get "/api/v1/properties", params: { bedrooms: 3 }
      ids = response.parsed_body["properties"].map { |p| p["id"] }
      expect(ids).to include(house.id)
      expect(ids).not_to include(apartment.id)
    end

    it "filters by price range" do
      get "/api/v1/properties", params: { price_min: 400_000, price_max: 600_000 }
      ids = response.parsed_body["properties"].map { |p| p["id"] }
      expect(ids).to include(house.id)
      expect(ids).not_to include(apartment.id)
    end

    it "filters by status" do
      get "/api/v1/properties", params: { status: "sold" }
      ids = response.parsed_body["properties"].map { |p| p["id"] }
      expect(ids).to include(apartment.id)
      expect(ids).not_to include(house.id)
    end

    it "paginates results" do
      create_list(:property, 30)
      get "/api/v1/properties", params: { page: 1, per_page: 10 }
      expect(response.parsed_body["properties"].length).to eq(10)
      expect(response.parsed_body["meta"]["total_count"]).to be >= 32
    end
  end

  describe "GET /api/v1/properties/:id" do
    it "returns the property" do
      get "/api/v1/properties/#{house.id}"
      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["id"]).to eq(house.id)
    end

    it "returns 404 for missing property" do
      get "/api/v1/properties/99999"
      expect(response).to have_http_status(:not_found)
    end
  end
end
