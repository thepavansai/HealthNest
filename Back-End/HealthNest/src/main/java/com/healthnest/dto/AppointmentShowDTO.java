package com.healthnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentShowDTO {
    private String doctorName;
    private String userName;
    private String appointmentStatus;
    private String appointmentDate;
    private String appointmentTime;
}
