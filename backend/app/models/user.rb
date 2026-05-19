class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :watchlists, dependent: :destroy
  has_many :watched_properties, through: :watchlists, source: :property
  has_many :saved_searches, dependent: :destroy
end
