package com.healthnest.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class AdminPrincipal implements UserDetails {

    // Store the hash passed in during instantiation
    private final String passwordHash;

    public AdminPrincipal(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    @Override
    public String getPassword() {
        return this.passwordHash; // Return the dynamic hash
    }

    @Override
    public String getUsername() {
        return "admin";
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return true;
    }
}