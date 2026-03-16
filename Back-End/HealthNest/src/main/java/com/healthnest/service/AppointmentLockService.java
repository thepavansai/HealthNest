package com.healthnest.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Service
public class AppointmentLockService {
    
    private final ConcurrentHashMap<String, Lock> locks = new ConcurrentHashMap<>();

    public Lock getLockForSlot(Long doctorId, LocalDate date, LocalTime time) {
        // Creates a unique key: e.g., "5-2026-03-20-10:30"
        String lockKey = doctorId + "-" + date.toString() + "-" + time.toString();
        return locks.computeIfAbsent(lockKey, k -> new ReentrantLock());
    }
    
    public void removeLock(Long doctorId, LocalDate date, LocalTime time) {
        String lockKey = doctorId + "-" + date.toString() + "-" + time.toString();
        locks.remove(lockKey); // Clean up to prevent memory leaks
    }
}