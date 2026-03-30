package com.healthnest.repository;

import com.healthnest.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findBySpecializedroleContaining(String specialization);

    boolean existsByEmailId(String email);

    Optional<Doctor> findByEmailId(String email);

    // Corrected query to find nearby doctors using the Haversine formula
    @Query("SELECT d FROM Doctor d " +
           "WHERE (6371 * acos(cos(radians(:lat)) * cos(radians(d.latitude)) " +
           "* cos(radians(d.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(d.latitude)))) <= :radius " +
           "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(d.latitude)) " +
           "* cos(radians(d.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(d.latitude)))) ASC")
    List<Doctor> findNearbyDoctors(@Param("lat") double latitude,
                                   @Param("lng") double longitude,
                                   @Param("radius") double radius);
}
