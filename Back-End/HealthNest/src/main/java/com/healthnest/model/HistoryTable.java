package com.healthnest.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
@Table(name = "history_table")
public class HistoryTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id",nullable = false)
    private Long doctorId;
    
    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Long appointmentId;
    
    private Long symptomId;
    private String diagnosis;
    private Date date;
    
    
}