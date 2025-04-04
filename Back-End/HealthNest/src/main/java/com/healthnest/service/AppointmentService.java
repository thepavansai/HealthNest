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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthnest.Repository.AppointmentsRepository;
import com.healthnest.model.Appointment;
import com.healthnest.model.Doctor;
import com.healthnest.model.User;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AppointmentService {

    @Autowired
    AppointmentsRepository appointmentsRepository;

    private Map<String, Object> mapAppointment(Appointment a) {
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

        return m;
    }
    private Map<String, Object> mapAppointmentWithUserInfo(Appointment a) {
        User u = a.getUser();
        Map<String, Object> m = new HashMap<>();
        m.put("userName", u.getName());
        m.put("userEmail", u.getEmail());
        m.put("userPhone", u.getPhoneNo());
        m.put("appointmentDate", a.getAppointmentDate());
        m.put("appointmentTime", a.getAppointmentTime());
        m.put("appointmentStatus", a.getAppointmentStatus());
        m.put("description", a.getDescription());
        return m;
    }

    public List<Map<String, Object>> getUpcomingAppointments(Integer userId) {
        List<Appointment> appointments = appointmentsRepository.findByUserUserId(userId);
        List<Map<String, Object>> result1 = new ArrayList<>();

        for (Appointment a : appointments) {
            if ("Upcoming".equalsIgnoreCase(a.getAppointmentStatus())) {
                result1.add(mapAppointment(a));
            }
        }

        return result1;
    }

    public List<Map<String, Object>> getCompletedAppointments(Integer userId) {
        List<Appointment> appointments = appointmentsRepository.findByUserUserId(userId);
        List<Map<String, Object>> result2 = new ArrayList<>();

        for (Appointment a : appointments) {
            if ("Completed".equalsIgnoreCase(a.getAppointmentStatus())) {
                result2.add(mapAppointment(a));
            }
        }

        return result2;
    }

    public List<Map<String, Object>> getCancelledAppointments(Integer userId) {
        List<Appointment> appointments = appointmentsRepository.findByUserUserId(userId);
        List<Map<String, Object>> result3 = new ArrayList<>();

        for (Appointment a : appointments) {
            if ("Cancelled".equalsIgnoreCase(a.getAppointmentStatus())) {
                result3.add(mapAppointment(a));
            }
        }

        return result3;
    }
    
    public List<Map<String, Object>> getAppointmentsForDoctor(Long doctorId) {
        List<Appointment> appointments = appointmentsRepository.findByDoctorDoctorId(doctorId);
        return appointments.stream().map(this::mapAppointmentWithUserInfo).toList();
    }

    public List<Map<String, Object>> getAppointmentsForDoctorByStatus(Long doctorId, String status) {
        List<Appointment> appointments = appointmentsRepository.findByDoctorDoctorIdAndAppointmentStatusIgnoreCase(doctorId, status);
        return appointments.stream().map(this::mapAppointmentWithUserInfo).toList();
    }

    public List<Map<String, Object>> getAppointmentsForDoctorByUser(Long doctorId, Integer userId) {
        List<Appointment> appointments = appointmentsRepository.findByDoctorDoctorIdAndUserUserId(doctorId, userId);
        return appointments.stream().map(this::mapAppointmentWithUserInfo).toList();
    }

}

