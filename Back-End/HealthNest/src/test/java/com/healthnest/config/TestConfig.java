package com.healthnest.config;

import static org.mockito.Mockito.mock;

import org.modelmapper.ModelMapper;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.healthnest.service.DoctorService;

@TestConfiguration
@Profile("test") // Activate test profile
public class TestConfig {
    
    @Bean
    @Primary
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
    
    @Bean
    @Primary
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    
    @Bean
    @Primary
    DoctorService doctorService() {
        return mock(DoctorService.class);
    }
}
