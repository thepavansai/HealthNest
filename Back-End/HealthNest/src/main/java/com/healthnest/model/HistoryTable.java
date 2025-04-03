package com.healthnest.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "history_table")
public class HistoryTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private Long doctorId;
    private Long appointmentId;
    private Long symptomId;
    private String diagnosis;
    private Date date;
}