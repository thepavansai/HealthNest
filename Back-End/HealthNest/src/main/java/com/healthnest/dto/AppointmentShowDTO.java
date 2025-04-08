package com.healthnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentShowDTO {
    private Integer appointmentId;
    private String doctorName;
    private String doctorSpecialization;
    private String userName;
    private String userPhoneNo;
    private String appointmentStatus;
    private String description;
    private String appointmentDate;
    private String appointmentTime;
}
