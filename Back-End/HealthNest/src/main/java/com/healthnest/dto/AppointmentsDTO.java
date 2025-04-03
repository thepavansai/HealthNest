package com.healthnest.dto;

import lombok.Data;

@Data
public class AppointmentsDTO {
    private int appointmentId;
    private Integer userId;
    private Integer doctorId;
    private String appointmentDate;
    private String appointmentTime;
    private String appointmentStatus;
    private String description;
}
