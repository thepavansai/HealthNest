package com.healthnest.Repository;

import com.healthnest.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    
    List<Doctor> findByAvailabilityIgnoreCase(String availability);

    
    List<Doctor> findByRatingGreaterThanEqual(Integer rating);

   
    Optional<Doctor> findByEmailId(String emailId);
}

