package com.healthnest.model;

import com.healthnest.model.enums.Gender;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

@Entity(name="Symptoms")
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

    public void setSymptomId(Long symptomId) {

        this.symptomId = symptomId;
    }

    public Long getSymptomId() {

        return symptomId;
    }

    public Double getDuration() {
        return duration;
    }

    public void setDuration(Double duration) {
        this.duration = duration;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSymptomDescription() {
        return symptomDescription;
    }

    public void setSymptomDescription(String symptomDescription) {
        this.symptomDescription = symptomDescription;
    }

    public String getSymptomName() {
        return symptomName;
    }

    public void setSymptomName(String symptomName) {
        this.symptomName = symptomName;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Symptoms() {
    }

    public Symptoms(Integer age, Gender gender, Double weight, Double temperature, String symptomName, String symptomDescription, String location, Double duration) {
        this.age = age;
        this.gender = gender;
        this.weight = weight;
        this.temperature = temperature;
        this.symptomName = symptomName;
        this.symptomDescription = symptomDescription;
        this.location = location;
        this.duration = duration;
    }

    @Override
    public String toString() {
        return "Symptoms{" +
                "age=" + age +
                ", symptomName='" + symptomName + '\'' +
                ", symptomDescription='" + symptomDescription + '\'' +
                ", location='" + location + '\'' +
                ", gender=" + gender +
                ", duration=" + duration +
                ", weight=" + weight +
                ", temperature=" + temperature +
                '}';
    }
}
