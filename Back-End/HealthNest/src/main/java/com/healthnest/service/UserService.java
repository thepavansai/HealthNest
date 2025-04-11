package com.healthnest.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthnest.repository.AppointmentRepository;
import com.healthnest.repository.UserRepository;
import com.healthnest.model.Appointment;
import com.healthnest.model.User;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.exception.AuthenticationException;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {

	@Autowired
	UserRepository userRepository;
	@Autowired
	AppointmentRepository appointmentRepository;

	public void createUser(User user) {
		if (isUserAlreadyRegistered(user.getEmail())) {
			throw new IllegalArgumentException("User already exists!");
		}
		userRepository.save(user);
	}
	
	public User getUserDetails(Integer userId) {
	    return userRepository.findById(userId)
	            .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
	}

	public boolean isUserAlreadyRegistered(String email) {
		Optional<User> user = userRepository.findByEmail(email);
		return user.isPresent();
	}

	public boolean editProfile(User user, Integer userId) {
		User existingUser = userRepository.findById(userId)
	            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
		
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

	public void cancelAppointment(Integer appointmentId) {
		Appointment appointment = appointmentRepository.findById(appointmentId).get();
		appointment.setAppointmentStatus("Cancelled");
	}

	public boolean changePassword(Integer userId, String oldPassword, String newPassword) {
		User user = userRepository.findById(userId)
	            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
		
		if (!user.getPassword().equals(oldPassword)) {
			throw new IllegalArgumentException("Current password is incorrect");
		}
		
		user.setPassword(newPassword);
		userRepository.save(user);
		return true;
	}

	public void deleteAccount(Integer userId) {
	    if (!userRepository.existsById(userId)) {
	        throw new UserNotFoundException("User not found with id: " + userId);
	    }
	    userRepository.deleteById(userId);
	}
	
	public boolean bookAppointment(Appointment appointment) {
        appointmentRepository.save(appointment);
        return true;
	}

	public String login(String email, String password) {
	    return userRepository.findByEmail(email)
	        .map(user -> {
	            if (!user.getPassword().equals(password)) {
	                throw new AuthenticationException("Invalid Password");
	            }
	            return "Login successful";
	        })
	        .orElseThrow(() -> new UserNotFoundException("User doesn't exist"));
	}

	public Integer getUserId(String email) {
	    return userRepository.findByEmail(email)
	        .map(User::getUserId)
	        .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
	}

	public String getUserName(String email) {
		return userRepository.findByEmail(email).get().getName();
	}
	
	public String deleteAllUsers() {
		userRepository.deleteAll();
		return "All users deleted";
	}
}
