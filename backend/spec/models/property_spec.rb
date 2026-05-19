require 'rails_helper'

RSpec.describe Property, type: :model do
  subject(:property) { build(:property) }

  describe "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:price) }
    it { should validate_presence_of(:property_type) }
    it { should validate_presence_of(:status) }
    it { should validate_presence_of(:address) }
    it { should validate_inclusion_of(:property_type).in_array(Property::PROPERTY_TYPES) }
    it { should validate_inclusion_of(:status).in_array(Property::STATUSES) }
    it { should validate_numericality_of(:price).is_greater_than(0) }
  end

  describe "associations" do
    it { should have_many(:watchlists).dependent(:destroy) }
    it { should have_many(:watchers).through(:watchlists).source(:user) }
  end

  describe "scopes" do
    let!(:cheap_house) { create(:property, price: 300_000, bedrooms: 2, property_type: "house", status: "for_sale") }
    let!(:expensive_apartment) { create(:property, price: 900_000, bedrooms: 3, property_type: "apartment", status: "sold") }

    describe ".by_price_range" do
      it "filters min price" do
        expect(Property.by_price_range(500_000, nil)).to include(expensive_apartment)
        expect(Property.by_price_range(500_000, nil)).not_to include(cheap_house)
      end

      it "filters max price" do
        expect(Property.by_price_range(nil, 500_000)).to include(cheap_house)
        expect(Property.by_price_range(nil, 500_000)).not_to include(expensive_apartment)
      end

      it "filters price range" do
        expect(Property.by_price_range(200_000, 500_000)).to include(cheap_house)
        expect(Property.by_price_range(200_000, 500_000)).not_to include(expensive_apartment)
      end
    end

    describe ".by_bedrooms" do
      it "filters by bedroom count" do
        expect(Property.by_bedrooms(2)).to include(cheap_house)
        expect(Property.by_bedrooms(2)).not_to include(expensive_apartment)
      end

      it "returns all when nil" do
        expect(Property.by_bedrooms(nil).count).to eq(Property.count)
      end
    end

    describe ".by_property_type" do
      it "filters by property type" do
        expect(Property.by_property_type("house")).to include(cheap_house)
        expect(Property.by_property_type("house")).not_to include(expensive_apartment)
      end
    end

    describe ".by_status" do
      it "filters by status" do
        expect(Property.by_status("sold")).to include(expensive_apartment)
        expect(Property.by_status("sold")).not_to include(cheap_house)
      end
    end

    describe ".by_keyword" do
      let!(:unique_property) { create(:property, title: "Zephyr Penthouse", address: "1 Test St", description: "Unique desc") }

      it "matches title" do
        expect(Property.by_keyword("Zephyr")).to include(unique_property)
        expect(Property.by_keyword("Zephyr")).not_to include(cheap_house)
      end

      it "matches address" do
        expect(Property.by_keyword("Test St")).to include(unique_property)
      end

      it "matches description" do
        expect(Property.by_keyword("Unique desc")).to include(unique_property)
      end

      it "returns all when blank" do
        expect(Property.by_keyword(nil).count).to eq(Property.count)
        expect(Property.by_keyword("").count).to eq(Property.count)
      end

      it "is case insensitive" do
        expect(Property.by_keyword("zephyr")).to include(unique_property)
      end
    end

    describe ".near" do
      let!(:sydney_property) { create(:property, latitude: -33.8688, longitude: 151.2093) }
      let!(:melbourne_property) { create(:property, latitude: -37.8136, longitude: 144.9631) }

      it "returns properties within radius" do
        results = Property.near(-33.8688, 151.2093, 10)
        expect(results).to include(sydney_property)
        expect(results).not_to include(melbourne_property)
      end
    end
  end

  describe "ActionCable broadcast" do
    let(:property) { create(:property) }

    it "broadcasts on price change" do
      expect(ActionCable.server).to receive(:broadcast).with("property_#{property.id}", hash_including(:price))
      property.update!(price: 500_000)
    end

    it "broadcasts on status change" do
      expect(ActionCable.server).to receive(:broadcast).with("property_#{property.id}", hash_including(:status))
      property.update!(status: "sold")
    end

    it "does not broadcast on non-relevant change" do
      expect(ActionCable.server).not_to receive(:broadcast)
      property.update!(title: "New title")
    end
  end
end
