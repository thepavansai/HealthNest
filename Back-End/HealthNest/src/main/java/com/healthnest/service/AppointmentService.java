//package com.healthnest.service;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.healthnest.Repository.AppointmentsRepository;
//import com.healthnest.model.Appointment;
//import com.healthnest.model.Doctor;
//
//import jakarta.transaction.Transactional;
//
//@Service
//@Transactional
//public class AppointmentService {
//	@Autowired AppointmentsRepository appointmentsRepository;
//
//	public List<Map<String, Object>> getAppointmentsForUser(Integer userId) {
//	    List<Appointment> appointments = appointmentsRepository.findByUserUserId(userId);
//
//	    List<Map<String, Object>> result = new ArrayList<>();
//	    for (Appointment a : appointments) {
//	        Doctor d = a.getDoctor();
//	        Map<String, Object> m = new HashMap<>();
//	        m.put("doctorName", d.getDoctorName());
//	        m.put("experience", d.getExperience());
//	        m.put("docPhnNo", d.getDocPhnNo());
//	        m.put("consultationFee", d.getConsultationFee());
//	        m.put("rating", d.getRating());
//	        m.put("hospitalName", d.getHospitalName());
//
//	        m.put("appointmentDate", a.getAppointmentDate());
//	        m.put("appointmentTime", a.getAppointmentTime());
//	        m.put("appointmentStatus", a.getAppointmentStatus());
//	        m.put("description", a.getDescription());
//
//	        result.add(m);
//	    }
//
//	    return result;
//	}
//
//}
package com.healthnest.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthnest.Repository.AppointmentRepository;
import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.model.Appointment;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AppointmentService {

    @Autowired
    AppointmentRepository appointmentRepository;

    public List<AppointmentSummaryDTO> getAppointmentSummaries(Integer userId, String status) {
        return appointmentRepository.findAppointmentSummariesByUserIdAndStatus(userId, status);
    }

	public Appointment acceptAppointment(Integer appointmentId, Integer doctorId) {
		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));

		if (!appointment.getDoctor().getDoctorId().equals(doctorId)) {
			throw new RuntimeException("You are not authorized to accept this appointment");
		}

		appointment.setAppointmentStatus("Upcoming");
		return appointmentRepository.save(appointment);
	}

	public Appointment rejectAppointment(Integer appointmentId, Integer doctorId) {
		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));
		if (!appointment.getDoctor().getDoctorId().equals(doctorId)) {
			throw new RuntimeException("You are not authorized to reject this appointment");
		}

		appointment.setAppointmentStatus("Cancelled");
		return appointmentRepository.save(appointment);
	}
	public List<AppointmentShowDTO> getAppointments(Integer doctorId) {
		return appointmentRepository.findByDoctorIdWithUserName(doctorId);
	}
	public List<AppointmentShowDTO> getAllAppointments(){

        return appointmentRepository.findAllAppointments();
	}
	public String deleteAllAppointments(){
        appointmentRepository.deleteAll();
        return "All appointments deleted";
    }
    public String deleteAppointment(Integer appointmentId) {
        if (appointmentRepository.existsById(appointmentId)) {
            appointmentRepository.deleteById(appointmentId);
            return "Appointment with ID " + appointmentId + " has been successfully deleted.";
        } else {
            return "Appointment with ID " + appointmentId + " does not exist.";
        }
    }
}

