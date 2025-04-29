package com.healthnest.model;

import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class DoctorPrincipal implements UserDetails {
    private Doctor doctor;
    
    public DoctorPrincipal(Doctor doctor) {
        this.doctor = doctor;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(
            new SimpleGrantedAuthority("ROLE_DOCTOR")
        );
    }
    
    @Override
    public String getPassword() {
        return doctor.getPassword();
    }
    
    @Override
    public String getUsername() {
        return doctor.getEmailId();
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
        return doctor.getStatus() == 1; // Only enabled if doctor is approved
    }
}
