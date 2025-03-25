package com.healthnest.Repository;

import java.util.List;
import java.util.Optional;

//import org.hibernate.mapping.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.healthnest.model.Appointments;
import com.healthnest.model.Doctor;
import com.healthnest.model.HistoryTable;
import com.healthnest.model.Symptoms;
import com.healthnest.model.User;

@Repository
public interface HealthNestRespository extends CrudRepository {
	 Optional<Symptoms> findPredictionBySymptomId(Integer symptomId);
		Optional<Doctor> findDoctorByPredictionId(Integer id);
		List<Doctor> FindAllDoctors();
	 List<User> FindAllUsers();
		Optional<User> FindUserByID(Integer userId);
		Optional<Appointments> FindAppointmentByUserId(Integer userId);
		Optional<HistoryTable>FindHistoryByUserId(Integer userId);
}
