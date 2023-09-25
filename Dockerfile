# Use an appropriate base image for your Spring Boot application
FROM  openjdk:19-ea-26-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file of your Spring Boot application into the container
COPY target/InventoryManagementSystem-0.0.1-SNAPSHOT.jar app.jar

# Expose the port on which your Spring Boot application runs
EXPOSE 8087

# Run the Spring Boot application when the container starts
CMD ["java", "-jar", "app.jar"]