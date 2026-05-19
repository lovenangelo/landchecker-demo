class Rack::Attack
  throttle("req/ip", limit: 300, period: 5.minutes) do |req|
    req.ip unless req.path.start_with?("/cable")
  end

  throttle("logins/ip", limit: 5, period: 20.seconds) do |req|
    if req.path.include?("sign_in") && req.post?
      req.ip
    end
  end

  throttle("logins/email", limit: 5, period: 20.seconds) do |req|
    if req.path.include?("sign_in") && req.post?
      req.params["user"]&.dig("email")&.downcase&.gsub(/\s+/, "")
    end
  end

  self.throttled_responder = lambda do |req|
    [
      429,
      { "Content-Type" => "application/json" },
      [{ error: "Too many requests. Retry later." }.to_json]
    ]
  end
end
