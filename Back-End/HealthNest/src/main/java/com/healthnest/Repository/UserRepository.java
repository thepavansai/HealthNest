package com.healthnest.Repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.healthnest.model.User;
@Repository
public interface UserRepository extends CrudRepository<User,Integer> {
	
	

}
