require 'rails_helper'

RSpec.describe User, type: :model do
  describe "associations" do
    it { should have_many(:watchlists).dependent(:destroy) }
    it { should have_many(:watched_properties).through(:watchlists).source(:property) }
    it { should have_many(:saved_searches).dependent(:destroy) }
  end

  describe "validations" do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }
    it { should validate_presence_of(:password) }
  end
end
