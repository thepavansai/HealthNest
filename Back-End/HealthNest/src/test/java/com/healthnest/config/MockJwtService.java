package com.healthnest.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import com.healthnest.service.JWTService;
import static org.mockito.Mockito.*;

@TestConfiguration
public class MockJwtService {

    @Bean
    @Primary
    public JWTService jwtService() {
        JWTService mockJwtService = mock(JWTService.class);
        
        // Setup default behavior
        when(mockJwtService.extractUserEmail(anyString())).thenReturn("test@example.com");
        when(mockJwtService.extractRole(anyString())).thenReturn("USER");
        when(mockJwtService.extractUserRole(anyString())).thenReturn("USER");
        when(mockJwtService.generateToken(anyString(), anyString())).thenReturn("test-jwt-token");
        when(mockJwtService.validateToken(anyString(), any())).thenReturn(true);
        
        return mockJwtService;
    }
}
