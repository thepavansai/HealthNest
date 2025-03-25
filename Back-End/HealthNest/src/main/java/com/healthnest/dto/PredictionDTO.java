package com.healthnest.dto;

public class PredictionDTO {
	private Long id;
    private String severity;
    private String remedies;
    private Long remedyId;
    private String diseaseName;
    public PredictionDTO() {}
	public PredictionDTO(Long id, String severity, String remedies, Long remedyId, String diseaseName) {
		super();
		this.id = id;
		this.severity = severity;
		this.remedies = remedies;
		this.remedyId = remedyId;
		this.diseaseName = diseaseName;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getSeverity() {
		return severity;
	}
	public void setSeverity(String severity) {
		this.severity = severity;
	}
	public String getRemedies() {
		return remedies;
	}
	public void setRemedies(String remedies) {
		this.remedies = remedies;
	}
	public Long getRemedyId() {
		return remedyId;
	}
	public void setRemedyId(Long remedyId) {
		this.remedyId = remedyId;
	}
	public String getDiseaseName() {
		return diseaseName;
	}
	public void setDiseaseName(String diseaseName) {
		this.diseaseName = diseaseName;
	}
	@Override
	public String toString() {
		return "PredictionDto [id=" + id + ", severity=" + severity + ", remedies=" + remedies + ", remedyId="
				+ remedyId + ", diseaseName=" + diseaseName + "]";
	}
    

}
