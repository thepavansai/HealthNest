package com.healthnest.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTService {
    // Define role constants
    public static final String ROLE_USER = "USER";
    public static final String ROLE_DOCTOR = "DOCTOR";
    public static final String ROLE_ADMIN = "ADMIN";
    
    private String secretKey="j95mk48zLDAwGIMGsuPwDq1U1gK7GSVYazR3a2r212Y=";
    
    public String generateToken(String useremail, String role) {
        Map<String,Object> claims = new HashMap<>();
        claims.put("role", role); // Add role to claims
        
        return Jwts.builder()
                .claims(claims)
                .subject(useremail)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+1000*60*30))
                .signWith(getKey())
                .compact();
    }
    
    // Generate token for user
    public String generateUserToken(String email) {
        return generateToken(email, ROLE_USER);
    }
    
    // Generate token for doctor
    public String generateDoctorToken(String email) {
        return generateToken(email, ROLE_DOCTOR);
    }
    
    // Generate token for admin
    public String generateAdminToken(String email) {
        return generateToken(email, ROLE_ADMIN);
    }
    
    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    public String extractUserEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    // Add this method to fix the error
    public String extractUserRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }
    
    // Keep the existing extractRole method for backward compatibility
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }
    
    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
               .verifyWith(getKey())
               .build()
               .parseSignedClaims(token)
               .getPayload();
    }
    
    public boolean validateToken(String token, UserDetails userDetails) {
        final String useremail = extractUserEmail(token);
        return (useremail.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    // Helper methods to check roles
    public boolean isAdmin(String token) {
        return ROLE_ADMIN.equals(extractUserRole(token));
    }
    
    public boolean isDoctor(String token) {
        return ROLE_DOCTOR.equals(extractUserRole(token));
    }
    
    public boolean isUser(String token) {
        return ROLE_USER.equals(extractUserRole(token));
    }
}
