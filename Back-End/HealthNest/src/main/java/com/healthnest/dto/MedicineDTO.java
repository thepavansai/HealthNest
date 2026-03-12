package com.healthnest.dto;

import lombok.Data;

@Data
public class MedicineDTO {
    private String name;
    private String dosage;
    private String duration;
    private String instructions;
}