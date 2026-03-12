package com.healthnest.service;

import com.healthnest.dto.MedicineDTO;
import com.healthnest.dto.PrescriptionDTO;
import com.healthnest.model.Appointment;
import com.healthnest.model.Medicine;
import com.healthnest.model.Prescription;
import com.healthnest.repository.AppointmentRepository;
import com.healthnest.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Transactional
    public void savePrescription(PrescriptionDTO dto) {
        // 1. Check if prescription already exists (Immutability check)
        Optional<Prescription> existingPrescription = prescriptionRepository.findByAppointmentAppointmentId(dto.getAppointmentId());
        if (existingPrescription.isPresent()) {
            throw new RuntimeException("A prescription has already been issued for this appointment. It cannot be modified.");
        }

        // 2. Fetch the appointment
        Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + dto.getAppointmentId()));

        // 3. Create and save new prescription
        Prescription prescription = new Prescription();
        prescription.setAppointment(appointment);
        prescription.setDoctorId(dto.getDoctorId());
        prescription.setPatientName(dto.getPatientName());
        prescription.setAdditionalAdvice(dto.getAdditionalAdvice());
        prescription.setDate(LocalDate.now());

        List<Medicine> medicines = dto.getMedicines().stream().map(mDto -> {
            Medicine med = new Medicine();
            med.setName(mDto.getName());
            med.setDosage(mDto.getDosage());
            med.setDuration(mDto.getDuration());
            med.setInstructions(mDto.getInstructions());
            return med;
        }).collect(Collectors.toList());

        prescription.setMedicines(medicines);
        prescriptionRepository.save(prescription);

        // 4. Update appointment status to 'Reviewed'
        appointment.setAppointmentStatus("Reviewed");
        appointmentRepository.save(appointment);
    }

    public PrescriptionDTO getPrescriptionByAppointmentId(Long appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Prescription not found for Appointment ID: " + appointmentId));

        PrescriptionDTO dto = new PrescriptionDTO();
        dto.setAppointmentId(prescription.getAppointment().getAppointmentId());
        dto.setDoctorId(prescription.getDoctorId());
        dto.setPatientName(prescription.getPatientName());
        dto.setAdditionalAdvice(prescription.getAdditionalAdvice());
        dto.setDate(prescription.getDate()); 

        List<MedicineDTO> medDtos = prescription.getMedicines().stream().map(med -> {
            MedicineDTO mDto = new MedicineDTO();
            mDto.setName(med.getName());
            mDto.setDosage(med.getDosage());
            mDto.setDuration(med.getDuration());
            mDto.setInstructions(med.getInstructions());
            return mDto;
        }).collect(Collectors.toList());

        dto.setMedicines(medDtos);
        return dto;
    }
}