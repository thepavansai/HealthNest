package com.healthnest.model;

import com.healthnest.model.enums.Gender;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity(name="Symptoms")
@Data
public class Symptoms {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long symptomId;
    @NotNull
    private String symptomName;
    @NotNull
    private String symptomDescription;
    @NotNull
    private String location;
    @NotNull
    private Gender gender;
    @NotNull
    private Integer age;
    @NotNull
    private Double duration;
    @NotNull
    private Double weight;
    @NotNull
    private Double temperature;
}
