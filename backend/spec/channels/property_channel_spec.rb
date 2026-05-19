require 'rails_helper'

RSpec.describe PropertyChannel, type: :channel do
  let(:user) { create(:user) }
  let(:property) { create(:property) }

  before { stub_connection current_user: user }

  it "subscribes to property stream" do
    subscribe(property_id: property.id)
    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_from("property_#{property.id}")
  end

  it "rejects subscription for nonexistent property" do
    subscribe(property_id: 99999)
    expect(subscription).to be_rejected
  end
end
