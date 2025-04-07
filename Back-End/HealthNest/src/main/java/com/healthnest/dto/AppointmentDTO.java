package com.healthnest.dto;

import com.healthnest.model.Doctor;
import lombok.Data;

@Data
public class AppointmentDTO {
    private int appointmentId;
    private Integer userId;
    private Doctor doctor;
    private String appointmentDate;
    private String appointmentTime;
    private String appointmentStatus;
    private String description;
}
