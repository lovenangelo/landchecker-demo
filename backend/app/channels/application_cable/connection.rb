module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      token = request.params[:token] || request.headers["Authorization"]&.split(" ")&.last
      return reject_unauthorized_connection unless token

      payload = JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key!).first
      user = User.find(payload["sub"])
      user || reject_unauthorized_connection
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      reject_unauthorized_connection
    end
  end
end
