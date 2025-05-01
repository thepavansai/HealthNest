package com.healthnest.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.model.Appointment;
import com.healthnest.model.User;
import com.healthnest.repository.AppointmentRepository;
import com.healthnest.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AppointmentService {

    @Autowired
    AppointmentRepository appointmentRepository;
    @Autowired	
     UserRepository userRepository;

  

    public List<AppointmentSummaryDTO> getAppointmentSummaries(Integer userId) {
        return appointmentRepository.findAppointmentSummariesByUserId(userId);
    }

	public Appointment acceptAppointment(Integer appointmentId, Integer doctorId) {
        if (appointmentId == null || doctorId == null) {
            throw new IllegalArgumentException("Appointment ID and Doctor ID cannot be null");
        }

		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));

        validateAppointment(appointment);

		if (!appointment.getDoctor().getDoctorId().equals(doctorId)) {
			throw new RuntimeException("You are not authorized to accept this appointment");
		}

		appointment.setAppointmentStatus("Upcoming");
		return appointmentRepository.save(appointment);
	}

    private void validateAppointment(Appointment appointment) {
        if (appointment.getAppointmentDate() == null) {
            throw new IllegalArgumentException("Appointment date cannot be null");
        }
        if (appointment.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Appointment date cannot be in the past");
        }
        if (appointment.getAppointmentTime() == null) {
            throw new IllegalArgumentException("Appointment time cannot be null");
        }
        if (appointment.getDescription() == null || appointment.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Appointment description cannot be empty");
        }
        if (appointment.getUser() == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (appointment.getDoctor() == null) {
            throw new IllegalArgumentException("Doctor cannot be null");
        }
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
	public String deleteAllAppointments() {
        try {
            appointmentRepository.deleteAll();
            return "All appointments deleted successfully";
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete all appointments: " + e.getMessage());
        }
    }
    public String deleteAppointment(Integer appointmentId) {
        if (appointmentRepository.existsById(appointmentId)) {
            appointmentRepository.deleteById(appointmentId);
            return "Appointment with ID " + appointmentId + " has been successfully deleted.";
        } else {
            return "Appointment with ID " + appointmentId + " does not exist.";
        }
    }

	public List<AppointmentShowDTO> getTodayAppointmentsByDoctor(Integer doctorId,LocalDate todaydate) {


	        
	        List<AppointmentShowDTO> appointments = appointmentRepository.findByDoctorIdWithUserName(doctorId);

	        
	        return appointments.stream()
	                .filter(appointment -> appointment.getAppointmentDate().isEqual(todaydate))
	                .collect(Collectors.toList());
	    }

	public String changeStatus(Integer appointmentId,String setStatus) {
		appointmentRepository.findById(appointmentId).get().setAppointmentStatus(setStatus);
		return "Sucessfully Completed";
	}

	 public boolean isAppointmentForDoctor(Integer appointmentId, Integer doctorId) {
	        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
	        
	        if (appointmentOpt.isPresent()) {
	            Appointment appointment = appointmentOpt.get();
	            return appointment.getDoctor().getDoctorId().equals(doctorId);
	        }
	        
	        return false;
	    }

	    /**
	     * Checks if an appointment belongs to a user with the given email
	     * 
	     * @param appointmentId the ID of the appointment to check
	     * @param email the email of the user to verify against
	     * @return true if the appointment belongs to the user with the given email, false otherwise
	     */
	    public boolean isAppointmentForUserEmail(Integer appointmentId, String email) {
	        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
	        Optional<User> userOpt = userRepository.findByEmail(email);
	        
	        if (appointmentOpt.isPresent() && userOpt.isPresent()) {
	            Appointment appointment = appointmentOpt.get();
	            User user = userOpt.get();
	            
	            return appointment.getUser().getUserId().equals(user.getUserId());
	        }
	        
	        return false;
	    }
	    public boolean updateAppointmentStatus(Integer appointmentId, String newStatus) {
	        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
	        
	        if (appointmentOpt.isPresent()) {
	            Appointment appointment = appointmentOpt.get();
	            appointment.setAppointmentStatus(newStatus);
	            appointmentRepository.save(appointment);
	            return true;
	        }
	        
	        return false;
	    }

		public boolean isUserEmailMatching(Integer userId, String email) {
			return userRepository.findById(userId).get().getEmail().equals(email);
		}

		 public List<AppointmentShowDTO> getAppointmentsByDoctorId(Integer doctorId) {
		        // Convert Long to Integer since your repository uses Integer
		        Integer doctorIdInt = doctorId.intValue();
		        return appointmentRepository.findByDoctorIdWithUserName(doctorIdInt);
		    }
}

