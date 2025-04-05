package com.healthnest.service;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthnest.Repository.AppointmentRepository;
import com.healthnest.Repository.UserRepository;
import com.healthnest.model.Appointment;
import com.healthnest.model.User;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {

	@Autowired
	UserRepository userRepository;
	@Autowired
	private ModelMapper modelMapper;
	@Autowired
	AppointmentRepository appointmentRepository;

	public void createUser(User user) {
		if (isUserAlreadyRegistered(user.getEmail())) {
			throw new RuntimeException("User already exists!");
		}
		userRepository.save(user);

	}

	public boolean isUserAlreadyRegistered(String email) {
		Optional<User> user = userRepository.findByEmail(email);
		return user.isPresent();
	}

	public boolean editProfile(User user) {
		User userafter = userRepository.findById(user.getUserId()).get();
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

	public void cancleAppointment(Integer appointmentId) {
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

}
