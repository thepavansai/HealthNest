
package com.healthnest.Repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.healthnest.model.Appointments;

@Repository
public interface AppointmentsRepository extends CrudRepository<Appointments, Integer> {
    Optional<Appointments> findByUserId(Integer userId);
}
