package com.healthnest.model;

import org.hibernate.annotations.ManyToAny;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Appointments {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer appointmentId;
    
    @NotNull
    private String appointmentDate;
    @NotNull
    private String appointmentTime;
    @NotNull
    private String appointmentStatus;
    @NotNull
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Doctor doctor;
    
    
    
}
