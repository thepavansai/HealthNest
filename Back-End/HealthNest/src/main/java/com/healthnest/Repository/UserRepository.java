package com.healthnest.Repository;
import com.healthnest.model.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.healthnest.model.Doctor;
import com.healthnest.model.User;
@Repository
public interface UserRepository extends CrudRepository<User,Integer> {
	Optional<User> findByEmail(String email);
	
	

}

