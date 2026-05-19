class CreateProperties < ActiveRecord::Migration[8.1]

  def change
    create_table :properties do |t|
      t.string :title
      t.text :description
      t.decimal :price
      t.integer :bedrooms
      t.string :property_type
      t.string :status
      t.string :address
      t.decimal :latitude
      t.decimal :longitude

      t.timestamps
    end

    add_index :properties, :price
    add_index :properties, :bedrooms
    add_index :properties, :property_type
    add_index :properties, :status
  end
end
