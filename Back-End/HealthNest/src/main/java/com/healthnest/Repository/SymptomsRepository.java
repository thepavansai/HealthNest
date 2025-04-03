package com.healthnest.Repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.healthnest.model.Symptoms;

@Repository
public interface SymptomsRepository extends CrudRepository<Symptoms, Integer> {
    Optional<Symptoms> findBySymptomId(Integer symptomId);
}
