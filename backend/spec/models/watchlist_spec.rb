require 'rails_helper'

RSpec.describe Watchlist, type: :model do
  describe "associations" do
    it { should belong_to(:user) }
    it { should belong_to(:property) }
  end

  describe "validations" do
    subject { create(:watchlist) }
    it { should validate_uniqueness_of(:user_id).scoped_to(:property_id).with_message("already watching this property") }
  end
end
