package com.healthnest.Repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.healthnest.model.Prediction;

@Repository
public interface PredictionRepository extends CrudRepository<Prediction, Integer> {
    Optional<Prediction> findById(Integer predictionId);
  //  Optional<Prediction> findBySymptomId(Integer symptomId); // Find predictions based on symptom
}