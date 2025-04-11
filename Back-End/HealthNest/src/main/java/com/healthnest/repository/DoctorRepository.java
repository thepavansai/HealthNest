package com.healthnest.repository;

import com.healthnest.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializedroleContaining(String specialization);
    boolean existsByEmailId(String email);
	Optional<Doctor> findByEmailId(String email);
}
