class CreateSavedSearches < ActiveRecord::Migration[8.1]
  def change
    create_table :saved_searches do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.jsonb :search_params, null: false, default: {}
      t.timestamps
    end
    add_index :saved_searches, [:user_id, :name], unique: true
    add_index :saved_searches, :search_params, using: :gin
  end
end
