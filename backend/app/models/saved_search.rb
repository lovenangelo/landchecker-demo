class SavedSearch < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates :name, uniqueness: { scope: :user_id }
  validates :search_params, presence: true

  ALLOWED_PARAMS = %w[price_min price_max bedrooms property_type status lat lng radius_km keyword].freeze

  def sanitized_params
    search_params.slice(*ALLOWED_PARAMS)
  end
end
