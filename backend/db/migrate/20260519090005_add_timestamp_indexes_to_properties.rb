class AddTimestampIndexesToProperties < ActiveRecord::Migration[8.1]
  def change
    add_index :properties, :created_at
    add_index :properties, :updated_at
  end
end
