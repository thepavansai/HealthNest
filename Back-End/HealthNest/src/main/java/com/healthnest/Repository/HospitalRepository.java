package com.healthnest.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.healthnest.model.Hospital;

@Repository
public interface HospitalRepository extends CrudRepository<Hospital, Integer> {
    Optional<Hospital> findById(Integer hospitalId);
    List<Hospital> findAll(); // Fetch all hospitals
    Optional<Hospital> findByName(String name); // Example custom method for finding by name
}
