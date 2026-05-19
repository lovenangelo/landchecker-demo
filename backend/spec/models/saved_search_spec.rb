require 'rails_helper'

RSpec.describe SavedSearch, type: :model do
  describe "associations" do
    it { should belong_to(:user) }
  end

  describe "validations" do
    subject { create(:saved_search) }
    it { should validate_presence_of(:name) }
    it { should validate_uniqueness_of(:name).scoped_to(:user_id) }
  end

  describe "#sanitized_params" do
    let(:saved_search) { build(:saved_search, search_params: { "property_type" => "house", "evil_param" => "hack" }) }

    it "only returns allowed params" do
      expect(saved_search.sanitized_params).to include("property_type" => "house")
      expect(saved_search.sanitized_params).not_to have_key("evil_param")
    end
  end
end
