package com.healthnest.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentShowDTO {
    private Long appointmentId;  // Changed from Integer to Long
    private String doctorName;
    private String doctorSpecialization;
    private String userName;
    private String userPhoneNo;
    private String appointmentStatus;
    private String description;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
}
