package com.healthnest.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthnest.Repository.AppointmentsRepository;
import com.healthnest.model.Appointments;
import com.healthnest.model.Doctor;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AppointmentService {
	@Autowired AppointmentsRepository appointmentsRepository;

	public List<Map<String, Object>> getAppointmentsForUser(Integer userId) {
	    List<Appointments> appointments = appointmentsRepository.findByUserUserId(userId);

	    List<Map<String, Object>> result = new ArrayList<>();
	    for (Appointments a : appointments) {
	        Doctor d = a.getDoctor();
	        Map<String, Object> m = new HashMap<>();
	        m.put("doctorName", d.getDoctorName());
	        m.put("experience", d.getExperience());
	        m.put("docPhnNo", d.getDocPhnNo());
	        m.put("consultationFee", d.getConsultationFee());
	        m.put("rating", d.getRating());
	        m.put("hospitalName", d.getHospitalName());

	        m.put("appointmentDate", a.getAppointmentDate());
	        m.put("appointmentTime", a.getAppointmentTime());
	        m.put("appointmentStatus", a.getAppointmentStatus());
	        m.put("description", a.getDescription());

	        result.add(m);
	    }

	    return result;
	}

}
