package com.healthnest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.Executor;

@Configuration
public class AsyncConfig {

    @Bean(name = "bookingThreadPool")
    public Executor bookingThreadPool() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        // The base number of threads kept alive
        executor.setCorePoolSize(50); 
        // The maximum number of threads allowed during huge traffic spikes
        executor.setMaxPoolSize(100); 
        // How many requests can wait in the queue before we start rejecting them
        executor.setQueueCapacity(5000); 
        executor.setThreadNamePrefix("BookingThread-");
        executor.initialize();
        return executor;
    }
}