package com.healthnest.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.healthnest.model.Doctor;
import com.healthnest.model.DoctorPrincipal;
import com.healthnest.model.User;
import com.healthnest.model.UserPrincipal;
import com.healthnest.repository.DoctorRepository;
import com.healthnest.repository.UserRepository;

@Service
@Primary
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AdminDetailsService adminDetailsService; // inject instead of duplicating

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Delegate admin auth to the proper service that handles password hashing
        if ("admin".equals(username)) {
            return adminDetailsService.loadUserByUsername(username);
        }

        User user = userRepository.findByEmail(username).orElse(null);
        if (user != null) {
            return new UserPrincipal(user);
        }

        Doctor doctor = doctorRepository.findByEmailId(username).orElse(null);
        if (doctor != null) {
            return new DoctorPrincipal(doctor);
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}