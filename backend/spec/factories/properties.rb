FactoryBot.define do
  factory :property do
    sequence(:title) { |n| "Property #{n}" }
    description { Faker::Lorem.paragraph }
    price { Faker::Number.decimal(l_digits: 5, r_digits: 2) }
    bedrooms { rand(1..5) }
    property_type { Property::PROPERTY_TYPES.sample }
    status { "for_sale" }
    sequence(:address) { |n| "#{n} #{Faker::Address.street_name}" }
    latitude { Faker::Address.latitude }
    longitude { Faker::Address.longitude }
    image_url { Faker::Internet.url }
  end
end
