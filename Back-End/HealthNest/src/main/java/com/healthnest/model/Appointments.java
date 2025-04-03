package com.healthnest.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity(name="Appointments")
@Data
public class Appointments {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer appointmentId;
    @NotNull
    private Integer userId;
    @NotNull
    private Integer doctorId;
    @NotNull
    private String appointmentDate;
    @NotNull
    private String appointmentTime;
    @NotNull
    private String appointmentStatus;
}
