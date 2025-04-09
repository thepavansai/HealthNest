package com.healthnest.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.healthnest.model.Doctor;
import lombok.Data;

@Data
public class AppointmentDTO {
    private int appointmentId;
    private Integer userId;
    private Doctor doctor;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String appointmentStatus;
    private String description;
}
