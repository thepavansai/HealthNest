
package com.healthnest.Repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.healthnest.model.Appointment;

@Repository
public interface AppointmentsRepository extends CrudRepository<Appointment, Integer> {

	List<Appointment> findByUserUserId(Integer userId);
	 List<Appointment> findByDoctorDoctorId(Long doctorId);
	  List<Appointment> findByDoctorDoctorIdAndAppointmentStatusIgnoreCase(Long doctorId, String status);
	  List<Appointment> findByDoctorDoctorIdAndUserUserId(Long doctorId, Integer userId);
	

	 
}
