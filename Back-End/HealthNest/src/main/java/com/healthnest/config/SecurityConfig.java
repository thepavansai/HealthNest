package com.healthnest.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	@Autowired
	private PasswordEncoder passwordencoder;
	
	@Autowired
	private JwtFilter jwtFilter;

    private final UserDetailsService userDetailsService;

    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
       return http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/users/Signup", "/users/login").permitAll() // Allow public access
                .anyRequest().authenticated() // Require authentication for all other requests
            ).httpBasic(Customizer.withDefaults())
            .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService); // Use UserDetailsService instead of UserService
        provider.setPasswordEncoder(passwordencoder); // Use BCryptPasswordEncoder
        return provider;
    }
    
//    @Bean
//    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception
//    {
//    	return config.getAuthenticationManager();
//    }
    
}
