FROM eclipse-temurin:17-jdk-alpine

# Add a non-root user to run the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set working directory
WORKDIR /app

# Copy the JAR file
COPY ./target/HealthNest-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Set JVM options for containerized environments
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]