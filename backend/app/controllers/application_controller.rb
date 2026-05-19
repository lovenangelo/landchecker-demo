class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_content
  rescue_from ActionController::ParameterMissing, with: :bad_request

  private

  def not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def unprocessable_content(exception)
    render json: { errors: exception.record.errors.full_messages }, status: :unprocessable_content
  end

  def bad_request(exception)
    render json: { error: exception.message }, status: :bad_request
  end

  def pagination_meta(collection)
    {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count,
      per_page: collection.limit_value
    }
  end
end
