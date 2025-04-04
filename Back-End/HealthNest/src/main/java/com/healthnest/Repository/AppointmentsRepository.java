
package com.healthnest.Repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.healthnest.model.Appointments;

@Repository
public interface AppointmentsRepository extends CrudRepository<Appointments, Integer> {

	List<Appointments> findByUserUserId(Integer userId);

	 
}
