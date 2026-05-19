module Api
  module V1
    module Users
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          if resource.persisted?
            render json: {
              message: "Account created successfully",
              user: { id: resource.id, email: resource.email },
              token: request.env['warden-jwt_auth.token']
            }, status: :created
          else
            render json: { errors: resource.errors.full_messages }, status: :unprocessable_content
          end
        end
      end
    end
  end
end
