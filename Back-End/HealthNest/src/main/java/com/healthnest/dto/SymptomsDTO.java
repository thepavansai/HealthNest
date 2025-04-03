package com.healthnest.dto;

import com.healthnest.dto.enums.Gender;
import lombok.Data;

@Data
public class SymptomsDTO {
    private String symptomName;
    private String symptomDescription;
    private String location;
    private Gender gender;
    private Integer age;
    private Double duration;
    private Double weight;
    private Double temperature;


}
