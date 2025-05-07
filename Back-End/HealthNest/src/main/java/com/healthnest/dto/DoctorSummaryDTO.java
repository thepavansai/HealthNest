package com.healthnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor // Generates a no-argument constructor
@AllArgsConstructor // Generates a constructor with all fields as arguments
public class DoctorSummaryDTO {
    private String name;
    private Float rating;
    private String location;
    private String hospital;
    private String availability;
    private String specialization;
    private Integer status;
}