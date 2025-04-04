package com.healthnest.service;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthnest.Repository.UserRepository;
import com.healthnest.model.User;

import jakarta.transaction.Transactional;

@Service
@Transactional
//@RequiredArgsConstructor
public class UserService {
	
	@Autowired
    UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;

    public void createUser(User user)
	{
		if (isUserAlreadyRegistered(user.getEmail())) {
            throw new RuntimeException("User already exists!");
        }
        userRepository.save(user);	
        
	}	
	public boolean isUserAlreadyRegistered(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent();
    }
	public User editProfile(User user) {
		User userafter=userRepository.findById(user.getUserId()).get();
		userafter.setName(user.getName());
		userafter.setPhoneNo(user.getPhoneNo());
		userafter.setEmail(user.getEmail());
		userafter.setDateOfBirth(user.getDateOfBirth());
		userafter.setGender(user.getGender());
		return userafter;
	}
	
	public List<User> getAllUsers()
	{
		 return (List<User>) userRepository.findAll();
	}
	
	public void cancleAppointment(Integer appointmentId)
	{
		
	}
	
	
	
    }
