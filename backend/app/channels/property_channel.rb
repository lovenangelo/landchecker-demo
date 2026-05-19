class PropertyChannel < ApplicationCable::Channel
  def subscribed
    property = Property.find(params[:property_id])
    stream_from "property_#{property.id}"
  rescue ActiveRecord::RecordNotFound
    reject
  end

  def unsubscribed
    stop_all_streams
  end
end
