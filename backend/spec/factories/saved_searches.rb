FactoryBot.define do
  factory :saved_search do
    association :user
    sequence(:name) { |n| "Search #{n}" }
    search_params { { "property_type" => "house", "bedrooms" => "3" } }
  end
end
