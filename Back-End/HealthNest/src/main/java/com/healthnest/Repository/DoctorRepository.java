package com.healthnest.Repository;

import com.healthnest.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializationContaining(String specialization);
    boolean existsByDoctorNameAndSpecialization(String doctorName, String specialization);
}
