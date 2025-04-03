package com.healthnest.dto;

import lombok.Data;

@Data
public class PrecautionsDTO {
    private Integer precautionId;
    private String diseaseName;
    private String description;
    private String remedies;
}
