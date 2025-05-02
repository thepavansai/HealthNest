package com.healthnest;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HealthNestApplication {

    public static void main(String[] args) {
        SpringApplication.run(HealthNestApplication.class, args);
    }
    public static void main(String[] args) {
        SpringApplication.run(HealthNestApplication.class, args);
    }

    @Bean
    ModelMapper modelMapper() {
        return new ModelMapper();
    }
    
    @Bean	
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public Jackson2ObjectMapperBuilder jacksonBuilder() {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
        // Disable writing dates as timestamps to use standard ISO-8601 format
        builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); 
        
        // Configure serializer to convert Long/long values to strings to preserve precision
        SimpleModule longModule = new SimpleModule();
        longModule.addSerializer(Long.class, ToStringSerializer.instance);
        longModule.addSerializer(long.class, ToStringSerializer.instance);
        
        // Register JavaTimeModule for proper LocalDate/LocalDateTime serialization/deserialization
        builder.modules(longModule, new JavaTimeModule()); 
        
        return builder;
    }
}
