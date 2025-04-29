package com.healthnest.model;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Table(name="\"feedback\"")  // Fixed table name with quotes and lowercase
@Entity
@Data
public class FeedBack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Changed from Integer to Long
    private String feedback;
    private String emailId;
    private Float rating;
    @ManyToOne
    @JoinColumn(name = "\"user_id\"", nullable = false)  // Fixed column name with quotes
    private User user;
}
