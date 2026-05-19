Rails.application.routes.draw do
  devise_for :users,
    path: 'api/v1/users',
    path_names: {
      sign_in: 'sign_in',
      sign_out: 'sign_out',
      registration: 'sign_up'
    },
    controllers: {
      sessions: 'api/v1/users/sessions',
      registrations: 'api/v1/users/registrations'
    }

  namespace :api do
    namespace :v1 do
      resources :properties, only: [:index, :show] do
        member do
          post :schedule_price_increase
        end
      end
      resources :watchlists, only: [:index, :create, :destroy]
      resources :saved_searches, only: [:index, :create, :destroy]
    end
  end

  mount ActionCable.server => '/cable'

  get "up" => "rails/health#show", as: :rails_health_check
end
