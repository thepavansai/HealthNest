package com.healthnest.model;


import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Entity
@Table(name = "Appointments")
@Data
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer appointmentId;

    @NotNull
    private LocalDate appointmentDate;
    @NotNull
    private LocalTime appointmentTime;

    @NotBlank(message = "Appointment status cannot be blank")
    @Pattern(regexp = "^(Pending|Upcoming|Cancelled|Completed)$", 
            message = "Status must be one of: Pending, Upcoming, Cancelled, Completed")
    private String appointmentStatus;

    @NotNull
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

}
