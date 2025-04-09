package com.healthnest.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthnest.repository.AppointmentRepository;
import com.healthnest.repository.UserRepository;
import com.healthnest.model.Appointment;
import com.healthnest.model.User;

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
			throw new RuntimeException("User already exists!");
		}
		userRepository.save(user);

	}
	
	public User getUserDetails(Integer userId) {
	    return userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
	}


	public boolean isUserAlreadyRegistered(String email) {
		Optional<User> user = userRepository.findByEmail(email);
		return user.isPresent();
	}

	public boolean editProfile(User user,Integer userId) {
		User userafter = userRepository.findById(userId).get();
		userafter.setName(user.getName());
		userafter.setPhoneNo(user.getPhoneNo());
		userafter.setEmail(user.getEmail());
		userafter.setDateOfBirth(user.getDateOfBirth());
		userafter.setGender(user.getGender());
		userRepository.save(userafter);
		return true;
	}

	public List<User> getAllUsers() {
		return (List<User>) userRepository.findAll();
	}

	public void cancelAppointment(Integer appointmentId) {
		Appointment appointment = appointmentRepository.findById(appointmentId).get();
		appointment.setAppointmentStatus("Cancelled");
	}

	public boolean changePassword(Integer userId, String before_password1, String Changed_password) {
		User user = userRepository.findById(userId).get();
		if (user.getPassword().equals(before_password1)) {
			user.setPassword(Changed_password);
			return true;
		} else {
			return false;

		}

	}

	public void deleteAccount(Integer userId) {
		userRepository.deleteById(userId);
	}
	
	public boolean bookAppointment(Appointment appointment)
	{
        appointmentRepository.save(appointment);
        return true;
		
	}

	
	public String login(String email, String password) {
	    Optional<User> userOpt = userRepository.findByEmail(email);

	    if (userOpt.isEmpty()) {
	        return "User doesn't exist";
	    }

	    User user = userOpt.get();
	    if (!user.getPassword().equals(password)) {
	        return "Invalid Password";
	    }

	    return "Login successful";
	}

 public Integer getUserId(String email)
 {
	 return userRepository.findByEmail(email).get().getUserId();	 
 }

public String getUserName(String email) {
	return userRepository.findByEmail(email).get().getName();
	
}
public String deleteAllUsers() {
		userRepository.deleteAll();
		return "All users deleted";
}

}
