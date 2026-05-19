module Api
  module V1
    module Users
      class SessionsController < Devise::SessionsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          if resource.persisted?
            render json: {
              message: "Logged in successfully",
              user: user_json(resource),
              token: request.env['warden-jwt_auth.token']
            }, status: :ok
          else
            render json: { error: "Invalid email or password" }, status: :unauthorized
          end
        end

        def respond_to_on_destroy
          if request.headers["Authorization"].present?
            render json: { message: "Logged out successfully" }, status: :ok
          else
            render json: { message: "No active session" }, status: :unauthorized
          end
        end

        def user_json(user)
          { id: user.id, email: user.email }
        end
      end
    end
  end
end
