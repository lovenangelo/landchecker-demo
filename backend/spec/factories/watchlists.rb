FactoryBot.define do
  factory :watchlist do
    association :user
    association :property
  end
end
