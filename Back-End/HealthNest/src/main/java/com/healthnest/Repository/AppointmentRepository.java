
package com.healthnest.Repository;

import java.util.List;

import com.healthnest.dto.AppointmentShowDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.healthnest.model.Appointment;

@Repository
public interface AppointmentRepository extends CrudRepository<Appointment, Integer> {

	List<Appointment> findByUserUserId(Integer userId);
	@Query("SELECT new com.healthnest.dto.AppointmentShowDTO(d.doctorName, u.name, a.appointmentStatus, a.appointmentDate, a.appointmentTime) " +
			"FROM Appointment a JOIN a.user u JOIN a.doctor d WHERE a.doctor.doctorId = :doctorId")
	List<AppointmentShowDTO> findByDoctorIdWithUserName(@Param("doctorId") Integer doctorId);
	 
}
