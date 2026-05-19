class Watchlist < ApplicationRecord
  belongs_to :user
  belongs_to :property

  validates :user_id, uniqueness: { scope: :property_id, message: "already watching this property" }

  after_create_commit  -> { broadcast_watchlist_change("added") }
  after_destroy_commit -> { broadcast_watchlist_change("removed") }

  private

  def broadcast_watchlist_change(action)
    ActionCable.server.broadcast("watchlist_user_#{user_id}", {
      action: action,
      property_id: property_id
    })
  end
end
