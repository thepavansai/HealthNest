package com.healthnest.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "\"prescription\"")
@Data
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "\"appointment_id\"", nullable = false)
    private Appointment appointment;

    @Column(name = "\"doctor_id\"")
    private Long doctorId;

    @Column(name = "\"patient_name\"")
    private String patientName;

    @ElementCollection
    @CollectionTable(name = "\"prescription_medicines\"", joinColumns = @JoinColumn(name = "\"prescription_id\""))
    private List<Medicine> medicines;

    @Column(columnDefinition = "TEXT")
    private String additionalAdvice;
    
    private LocalDate date;
}