package com.healthnest.Repository;

<<<<<<< HEAD



import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.healthnest.model.User;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
    Optional<User> findById(Integer userId);
    List<User> findAll(); // Admin - Fetch all users
}
=======
import com.healthnest.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends CrudRepository<User,Integer> {
	Optional<User> findByEmail(String email);
	

}
>>>>>>> 71981f74a59c5c0a6119d4df87e7693239a00151
