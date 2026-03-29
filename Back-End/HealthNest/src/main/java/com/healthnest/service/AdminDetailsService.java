package com.healthnest.service;

import com.healthnest.model.AdminPrincipal;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminDetailsService implements UserDetailsService {

    @Value("${admin.password}")
    private String rawAdminPassword;

    private final PasswordEncoder passwordEncoder;
    private String dynamicPasswordHash;


    public AdminDetailsService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        this.dynamicPasswordHash = passwordEncoder.encode(rawAdminPassword);
        this.rawAdminPassword = null;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if ("admin".equals(username)) {

            return new AdminPrincipal(this.dynamicPasswordHash);
        }
        throw new UsernameNotFoundException("User not found: " + username);
    }
}