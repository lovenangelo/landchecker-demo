class Property < ApplicationRecord
  has_many :watchlists, dependent: :destroy
  has_many :watchers, through: :watchlists, source: :user

  PROPERTY_TYPES = %w[house apartment townhouse unit land rural].freeze
  STATUSES = %w[for_sale for_rent sold leased].freeze

  validates :title, :price, :property_type, :status, :address, presence: true
  validates :price, numericality: { greater_than: 0 }
  validates :bedrooms, numericality: { greater_than_or_equal_to: 0, only_integer: true }, allow_nil: true
  validates :property_type, inclusion: { in: PROPERTY_TYPES }
  validates :status, inclusion: { in: STATUSES }
  validates :latitude, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }, allow_nil: true
  validates :longitude, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }, allow_nil: true

  scope :by_price_range, ->(min, max) {
    scope = all
    scope = scope.where("price >= ?", min.to_f) if min.present?
    scope = scope.where("price <= ?", max.to_f) if max.present?
    scope
  }
  scope :by_keyword, ->(q) {
    next all unless q.present?
    term = "%#{sanitize_sql_like(q)}%"
    where("title ILIKE :q OR address ILIKE :q OR description ILIKE :q", q: term)
  }
  scope :by_bedrooms, ->(n) { n.present? ? where(bedrooms: n.to_i) : all }
  scope :by_property_type, ->(type) { type.present? ? where(property_type: type) : all }
  scope :by_status, ->(status) { status.present? ? where(status: status) : all }
  scope :near, ->(lat, lng, radius_km = 10) {
    return all unless lat.present? && lng.present?
    lat, lng, radius_km = lat.to_f, lng.to_f, radius_km.to_f
    lat_delta = radius_km / 111.0
    lng_delta = radius_km / (111.0 * Math.cos(lat * Math::PI / 180.0))
    where(
      latitude: (lat - lat_delta)..(lat + lat_delta),
      longitude: (lng - lng_delta)..(lng + lng_delta)
    )
  }

  after_update :broadcast_property_update, if: :relevant_change?

  def as_json(options = {})
    super(options.merge(
      only: %i[id title description price bedrooms property_type status address
               latitude longitude image_url price_increase_at created_at updated_at]
    ))
  end

  private

  def broadcast_property_update
    ActionCable.server.broadcast("property_#{id}", {
      id: id,
      status: status,
      price: price.to_f,
      price_increase_at: price_increase_at,
      updated_at: updated_at
    })
  end

  def relevant_change?
    saved_change_to_status? || saved_change_to_price? || saved_change_to_price_increase_at?
  end
end
