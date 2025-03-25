package com.healthnest.dto;


public class HospitalDTO {
    private Long hospitalId;
    private String hospitalName;
    private String location;
    private String type;
    private String phoneNo;
    private String email;
    
    HospitalDTO(){
    	
    }

	public HospitalDTO(Long hospitalId, String hospitalName, String location, String type, String phoneNo,
			String email) {
		super();
		this.hospitalId = hospitalId;
		this.hospitalName = hospitalName;
		this.location = location;
		this.type = type;
		this.phoneNo = phoneNo;
		this.email = email;
	}

	public Long getHospitalId() {
		return hospitalId;
	}

	public void setHospitalId(Long hospitalId) {
		this.hospitalId = hospitalId;
	}

	public String getHospitalName() {
		return hospitalName;
	}

	public void setHospitalName(String hospitalName) {
		this.hospitalName = hospitalName;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPhoneNo() {
		return phoneNo;
	}

	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return "HospitalDto [hospitalId=" + hospitalId + ", hospitalName=" + hospitalName + ", location=" + location
				+ ", type=" + type + ", phoneNo=" + phoneNo + ", email=" + email + "]";
	}
    
    
}