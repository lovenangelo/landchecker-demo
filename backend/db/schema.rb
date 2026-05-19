# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_19_090006) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "properties", force: :cascade do |t|
    t.string "address"
    t.integer "bedrooms"
    t.datetime "created_at", null: false
    t.text "description"
    t.string "image_url"
    t.decimal "latitude"
    t.decimal "longitude"
    t.decimal "price"
    t.datetime "price_increase_at"
    t.string "property_type"
    t.string "status"
    t.string "title"
    t.datetime "updated_at", null: false
    t.index ["bedrooms"], name: "index_properties_on_bedrooms"
    t.index ["created_at"], name: "index_properties_on_created_at"
    t.index ["latitude", "longitude"], name: "index_properties_on_latitude_and_longitude"
    t.index ["price", "bedrooms", "property_type", "status"], name: "index_properties_on_search_filters"
    t.index ["price"], name: "index_properties_on_price"
    t.index ["price_increase_at"], name: "index_properties_on_price_increase_at"
    t.index ["property_type"], name: "index_properties_on_property_type"
    t.index ["status"], name: "index_properties_on_status"
    t.index ["updated_at"], name: "index_properties_on_updated_at"
  end

  create_table "saved_searches", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.jsonb "search_params", default: {}, null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["search_params"], name: "index_saved_searches_on_search_params", using: :gin
    t.index ["user_id", "name"], name: "index_saved_searches_on_user_id_and_name", unique: true
    t.index ["user_id"], name: "index_saved_searches_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "jti", default: "", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "watchlists", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "property_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["property_id"], name: "index_watchlists_on_property_id"
    t.index ["user_id", "property_id"], name: "index_watchlists_on_user_id_and_property_id", unique: true
    t.index ["user_id"], name: "index_watchlists_on_user_id"
  end

  add_foreign_key "saved_searches", "users"
  add_foreign_key "watchlists", "properties"
  add_foreign_key "watchlists", "users"
end
