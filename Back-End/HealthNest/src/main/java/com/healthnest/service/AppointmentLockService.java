package com.healthnest.service;

import com.google.common.util.concurrent.Striped;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.concurrent.locks.Lock;

@Service
public class AppointmentLockService {
    
    // We pre-allocate exactly 10,000 locks in memory. 
    // This array never grows, ensuring we never run out of memory.
    private final Striped<Lock> stripedLocks = Striped.lock(10000);

    public Lock getLockForSlot(Long doctorId, LocalDate date, LocalTime time) {
        // 1. Create the unique identifier for the slot
        String lockKey = doctorId + "-" + date.toString() + "-" + time.toString();
        
        // 2. Guava deterministically hashes the string and returns the exact same 
        // Lock object reference for any thread requesting this specific key.
        return stripedLocks.get(lockKey);
    }
}