package com.healthnest.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import com.healthnest.service.JWTService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;

class JWTServiceTest {

    private JWTService jwtService;
    private UserDetails userDetails;
    private static final String TEST_EMAIL = "test@example.com";

    @BeforeEach
    void setUp() {
        jwtService = new JWTService();
        userDetails = User.withUsername(TEST_EMAIL)
                .password("password")
                .authorities("USER")
                .build();
    }

    @Test
    void generateToken_WithUserRole_ReturnsValidToken() {
        // Act
        String token = jwtService.generateToken(TEST_EMAIL, JWTService.ROLE_USER);

        // Assert
        assertNotNull(token);
        assertEquals(TEST_EMAIL, jwtService.extractUserEmail(token));
        assertEquals(JWTService.ROLE_USER, jwtService.extractUserRole(token));
        assertFalse(jwtService.isTokenExpired(token));
    }

    @Test
    void generateUserToken_ReturnsTokenWithUserRole() {
        // Act
        String token = jwtService.generateUserToken(TEST_EMAIL);

        // Assert
        assertNotNull(token);
        assertEquals(JWTService.ROLE_USER, jwtService.extractUserRole(token));
    }

    @Test
    void generateDoctorToken_ReturnsTokenWithDoctorRole() {
        // Act
        String token = jwtService.generateDoctorToken(TEST_EMAIL);

        // Assert
        assertNotNull(token);
        assertEquals(JWTService.ROLE_DOCTOR, jwtService.extractUserRole(token));
    }

    @Test
    void generateAdminToken_ReturnsTokenWithAdminRole() {
        // Act
        String token = jwtService.generateAdminToken(TEST_EMAIL);

        // Assert
        assertNotNull(token);
        assertEquals(JWTService.ROLE_ADMIN, jwtService.extractUserRole(token));
    }

    @Test
    void extractUserEmail_ValidToken_ReturnsEmail() {
        // Arrange
        String token = jwtService.generateToken(TEST_EMAIL, JWTService.ROLE_USER);

        // Act
        String extractedEmail = jwtService.extractUserEmail(token);

        // Assert
        assertEquals(TEST_EMAIL, extractedEmail);
    }

    @Test
    void extractUserRole_ValidToken_ReturnsRole() {
        // Arrange
        String token = jwtService.generateToken(TEST_EMAIL, JWTService.ROLE_ADMIN);

        // Act
        String extractedRole = jwtService.extractUserRole(token);

        // Assert
        assertEquals(JWTService.ROLE_ADMIN, extractedRole);
    }

    @Test
    void extractRole_ValidToken_ReturnsRole() {
        // Arrange
        String token = jwtService.generateToken(TEST_EMAIL, JWTService.ROLE_DOCTOR);

        // Act
        String extractedRole = jwtService.extractRole(token);

        // Assert
        assertEquals(JWTService.ROLE_DOCTOR, extractedRole);
    }

    @Test
    void validateToken_ValidTokenAndMatchingUserDetails_ReturnsTrue() {
        // Arrange
        String token = jwtService.generateToken(TEST_EMAIL, JWTService.ROLE_USER);

        // Act
        boolean isValid = jwtService.validateToken(token, userDetails);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void validateToken_ValidTokenButDifferentUser_ReturnsFalse() {
        // Arrange
        String token = jwtService.generateToken(TEST_EMAIL, JWTService.ROLE_USER);
        UserDetails differentUser = User.withUsername("different@example.com")
                .password("password")
                .authorities("USER")
                .build();

        // Act
        boolean isValid = jwtService.validateToken(token, differentUser);

        // Assert
        assertFalse(isValid);
    }

   

    // Helper method to create a token with expired claims for testing
    private String createTokenWithExpiredClaims(Claims claims) {
        // This is a simplified method that won't actually work in the test
        // We'll rely on the ExpiredJwtException being thrown when we try to validate
        return "expired.token.signature";
    }

    @Test
    void isAdmin_WithAdminToken_ReturnsTrue() {
        // Arrange
        String token = jwtService.generateAdminToken(TEST_EMAIL);

        // Act
        boolean isAdmin = jwtService.isAdmin(token);

        // Assert
        assertTrue(isAdmin);
    }

    @Test
    void isAdmin_WithUserToken_ReturnsFalse() {
        // Arrange
        String token = jwtService.generateUserToken(TEST_EMAIL);

        // Act
        boolean isAdmin = jwtService.isAdmin(token);

        // Assert
        assertFalse(isAdmin);
    }

    @Test
    void isDoctor_WithDoctorToken_ReturnsTrue() {
        // Arrange
        String token = jwtService.generateDoctorToken(TEST_EMAIL);

        // Act
        boolean isDoctor = jwtService.isDoctor(token);

        // Assert
        assertTrue(isDoctor);
    }

    @Test
    void isDoctor_WithUserToken_ReturnsFalse() {
        // Arrange
        String token = jwtService.generateUserToken(TEST_EMAIL);

        // Act
        boolean isDoctor = jwtService.isDoctor(token);

        // Assert
        assertFalse(isDoctor);
    }

    @Test
    void isUser_WithUserToken_ReturnsTrue() {
        // Arrange
        String token = jwtService.generateUserToken(TEST_EMAIL);

        // Act
        boolean isUser = jwtService.isUser(token);

        // Assert
        assertTrue(isUser);
    }

    @Test
    void isUser_WithDoctorToken_ReturnsFalse() {
        // Arrange
        String token = jwtService.generateDoctorToken(TEST_EMAIL);

        // Act
        boolean isUser = jwtService.isUser(token);

        // Assert
        assertFalse(isUser);
    }
}
