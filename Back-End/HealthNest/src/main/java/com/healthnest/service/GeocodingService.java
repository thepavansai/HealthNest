package com.healthnest.service;

import com.healthnest.model.GeocodingResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;

@Service
public class GeocodingService {

    private static final String API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

    public double[] getCoordinates(String address) {
        try {
            String url = "https://maps.googleapis.com/maps/api/geocode/json?address="
                    + URLEncoder.encode(address, "UTF-8")
                    + "&key=" + API_KEY;

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<GeocodingResponse> response = restTemplate.getForEntity(url, GeocodingResponse.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                GeocodingResponse geocodingResponse = response.getBody();
                if (!geocodingResponse.getResults().isEmpty()) {
                    GeocodingResponse.Location location = geocodingResponse.getResults().get(0).getGeometry().getLocation();
                    return new double[]{location.getLatitude(), location.getLongitude()};
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
