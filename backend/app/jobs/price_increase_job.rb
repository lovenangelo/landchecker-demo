class PriceIncreaseJob < ApplicationJob
  queue_as :default

  def perform(property_id)
    property = Property.find_by(id: property_id)
    return unless property&.price_increase_at&.past?
    return unless property.status == "for_sale"

    new_price = (property.price * 1.1).round(2)
    property.update!(price: new_price, price_increase_at: nil)
  end
end
