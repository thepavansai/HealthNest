package com.healthnest.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.healthnest.exception.AuthenticationException;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.model.Appointment;
import com.healthnest.model.User;
import com.healthnest.model.UserPrincipal;
import com.healthnest.repository.AppointmentRepository;
import com.healthnest.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Use PasswordEncoder instead of BCryptPasswordEncoder
//    @Autowired
//    AuthenticationManager authmanager;
//    
    @Autowired
    private AuthenticationConfiguration authConfig;
    
    @Autowired
    JWTService jwtService;

    @Override
    public UserDetails loadUserByUsername(String useremail) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(useremail).orElseThrow(() -> 
            new UsernameNotFoundException("User doesn't exist"));
        return new UserPrincipal(user);
    }

    public void createUser(User user) {
        validateUser(user);
        if (isUserAlreadyRegistered(user.getEmail())) {
            throw new IllegalArgumentException("User already exists!");
        }
        // Set default role if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }
	
	private void validateUser(User user) {
		if (user == null) {
			throw new IllegalArgumentException("User cannot be null");
		}
		if (user.getName() == null || user.getName().trim().isEmpty()) {
			throw new IllegalArgumentException("User name cannot be empty");
		}
		if (user.getEmail() == null || !user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
			throw new IllegalArgumentException("Invalid email format");
		}
		if (user.getPassword() == null || user.getPassword().length() < 6) {
			throw new IllegalArgumentException("Password must be at least 6 characters long");
		}
		if (user.getPhoneNo() != null && !user.getPhoneNo().matches("\\d{10}")) {
			throw new IllegalArgumentException("Phone number must be 10 digits");
		}
	}
	
	public User getUserDetails(Long userId) {
	    return userRepository.findById(userId)
	            .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
	}

	public boolean isUserAlreadyRegistered(String email) {
		Optional<User> user = userRepository.findByEmail(email);
		return user.isPresent();
	}

	public boolean editProfile(User user, Long userId) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("User name cannot be empty");
        }
        if (user.getEmail() == null || !user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (user.getPhoneNo() != null && !user.getPhoneNo().matches("\\d{10}")) {
            throw new IllegalArgumentException("Invalid phone number format");
        }

        existingUser.setName(user.getName());
        existingUser.setName(user.getName());
        existingUser.setPhoneNo(user.getPhoneNo());
        existingUser.setEmail(user.getEmail());
        existingUser.setDateOfBirth(user.getDateOfBirth());
        existingUser.setGender(user.getGender());
        userRepository.save(existingUser);
        return true;
    }

	public List<User> getAllUsers() {
		return (List<User>) userRepository.findAll();
	}

	public void cancelAppointment(Long appointmentId) {
		Appointment appointment = appointmentRepository.findById(appointmentId).get();
		appointment.setAppointmentStatus("Cancelled");
	}

	public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long");
        }

        if (oldPassword.equals(newPassword)) {
            throw new IllegalArgumentException("New password must be different from the current password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

	public void deleteAccount(Long userId) {
	    if (!userRepository.existsById(userId)) {
	        throw new UserNotFoundException("User not found with id: " + userId);
	    }
	    userRepository.deleteById(userId);
	}

	public boolean bookAppointment(Appointment appointment) {
        appointmentRepository.save(appointment);
        return true;
	}


	public Map<String, String> login(String email, String password) {
        Map<String, String> response = new HashMap<>();
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User doesn't exist"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AuthenticationException("Invalid Password");
        }
        
        try {
            AuthenticationManager authmanager = authConfig.getAuthenticationManager();
            Authentication authentication = authmanager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
            
            if (authentication.isAuthenticated()) {
                // Generate token with USER role
                String token = jwtService.generateToken(email, "USER");
                System.out.println("Generated token: " + token);
                
                response.put("message", "Login successful");
                response.put("token", token);
                response.put("role", "USER");
                return response;
            }
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed", e);
        }
        
        response.put("message", "Login successful");
        return response;
    }


	public Long getUserId(String email) {
	    return userRepository.findByEmail(email)
	        .map(User::getUserId)
	        .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
	}

	public String getUserName(String email) {
		return userRepository.findByEmail(email).get().getName();
	}
	
	public String deleteAllUsers() {
		try {
			userRepository.deleteAll();
			return "All users and their appointments deleted successfully";
		} catch (Exception e) {
			throw new RuntimeException("Failed to delete all users: " + e.getMessage());
		}
	}
	
	public boolean setNewPassword(String email, String newPassword) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));	
		if (newPassword.length() < 6) {
			throw new IllegalArgumentException("New password must be at least 6 characters long");
		}
		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);
		return true;
	}
}
