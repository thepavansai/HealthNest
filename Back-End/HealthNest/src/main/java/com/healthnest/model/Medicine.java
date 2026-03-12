package com.healthnest.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Medicine {
    private String name;
    private String dosage;
    private String duration;
    private String instructions;
}