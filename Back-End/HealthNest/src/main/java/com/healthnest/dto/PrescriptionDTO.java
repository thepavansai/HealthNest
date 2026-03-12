package com.healthnest.dto;

import lombok.Data;
import java.time.LocalDate; // Make sure to import this
import java.util.List;

@Data
public class PrescriptionDTO {
    private Long appointmentId;
    private Long doctorId;
    private String patientName;
    private String additionalAdvice;
    
    // Change this from String to LocalDate
    private LocalDate date; 
    
    private List<MedicineDTO> medicines;
}