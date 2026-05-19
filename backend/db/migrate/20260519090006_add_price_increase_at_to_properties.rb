class AddPriceIncreaseAtToProperties < ActiveRecord::Migration[8.1]
  def change
    add_column :properties, :price_increase_at, :datetime
    add_index :properties, :price_increase_at
  end
end
