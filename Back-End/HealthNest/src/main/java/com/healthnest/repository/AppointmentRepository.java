
package com.healthnest.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.model.Appointment;

@Repository
public interface AppointmentRepository extends CrudRepository<Appointment, Integer> {

	List<Appointment> findByUserUserId(Integer userId);
	@Query("SELECT new com.healthnest.dto.AppointmentShowDTO(a.appointmentId,d.doctorName,d.specialization, u.name, u.phoneNo, a.appointmentStatus, a.description, a.appointmentDate, a.appointmentTime) " +
		       "FROM Appointment a JOIN a.user u JOIN a.doctor d WHERE a.doctor.doctorId = :doctorId")
	List<AppointmentShowDTO> findByDoctorIdWithUserName(@Param("doctorId") Integer doctorId);
	@Query("SELECT new com.healthnest.dto.AppointmentShowDTO(a.appointmentId,d.doctorName,d.specialization, u.name, u.phoneNo, a.appointmentStatus, a.description, a.appointmentDate, a.appointmentTime) " +
			"FROM Appointment a JOIN a.user u JOIN a.doctor d")
	List<AppointmentShowDTO> findAllAppointments();
	
	@Query("SELECT new com.healthnest.dto.AppointmentSummaryDTO(" +
		       "d.doctorName, d.experience, d.docPhnNo, d.consultationFee, d.rating, d.hospitalName, " +
		       "a.appointmentDate, a.appointmentTime, a.appointmentStatus, a.description) " +
		       "FROM Appointment a " +
		       "JOIN a.doctor d " +
		       "WHERE a.user.userId = :userId AND a.appointmentStatus = :status")
		List<AppointmentSummaryDTO> findAppointmentSummariesByUserIdAndStatus(@Param("userId") Integer userId,
		                                                                       @Param("status") String status);

	 
}
