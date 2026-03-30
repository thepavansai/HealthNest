package com.healthnest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class TestSecurityConfig {

    @Bean
    SecurityFilterChain testSecurityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints (match your production config)
                .requestMatchers("/users/Signup", "/users/login", "/doctor-signup", "/doctor-login", "/admin-login", "/feedback/all", "/doctor/all").permitAll()
                .requestMatchers("/users/check-email", "/users/setnewpassword").permitAll()
                .requestMatchers("/appointments/countall", "/users/countallusers", "/doctor/countalldoctors").permitAll()
                .requestMatchers("/doctor/check-email", "/doctor/setnewpassword").permitAll()
                
                // Require authentication for all other requests
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
    
    @Bean
    @Primary
    UserDetailsService userDetailsService() {
    	return new InMemoryUserDetailsManager();
    }
}
