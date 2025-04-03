package com.healthnest.dto;

import lombok.Data;

@Data
public class PredictionDTO {
	private Long id;
    private String severity;
    private String remedies;
    private Long remedyId;
    private String diseaseName;

}
