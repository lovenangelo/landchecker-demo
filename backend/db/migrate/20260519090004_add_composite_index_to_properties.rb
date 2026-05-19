class AddCompositeIndexToProperties < ActiveRecord::Migration[8.1]
  def change
    add_index :properties, [:latitude, :longitude]
    add_index :properties, [:price, :bedrooms, :property_type, :status], name: 'index_properties_on_search_filters'
  end
end
