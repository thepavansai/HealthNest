package com.healthnest.model;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Table
@Data
public class Precautions {
    @Id
    private Integer precautionId;
    private String diseaseName;
    private String description;
    private String remedies;
}
