package com.healthnest.Repository;
import com.healthnest.model.User;


import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends CrudRepository<User,Integer> {
	Optional<User> findByEmail(String email);

}

