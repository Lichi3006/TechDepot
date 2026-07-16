# ============================================
# Stage 1: Build the application
# ============================================
# Using full JDK (not alpine) because Maven Wrapper requires bash
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copy dependency descriptors and Maven Wrapper first for layer caching.
# These layers are invalidated only when dependencies change, not on every
# source code edit — significantly speeding up rebuilds.
COPY pom.xml ./
COPY .mvn .mvn
COPY mvnw ./

# Ensure the wrapper is executable, then pre-fetch all dependencies.
# -B enables batch mode (non-interactive, cleaner CI logs).
RUN chmod +x mvnw && \
    ./mvnw dependency:go-offline -B

# Now copy the source code (this layer changes most often)
COPY src/ src/

# application.properties is in .gitignore, so it won't exist in a fresh clone.
# Copy the example file as a fallback — environment variables injected via
# docker-compose.yml will override these defaults at runtime.
RUN cp src/main/resources/application.properties.example \
       src/main/resources/application.properties

# Build the JAR, skipping tests (they run in CI, not during image build)
RUN ./mvnw package -DskipTests -B

# ============================================
# Stage 2: Lightweight runtime image
# ============================================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy only the built artifact from the builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# --enable-native-access=ALL-UNNAMED is required by Spring Boot 4.x on Java 21
ENTRYPOINT ["java", "--enable-native-access=ALL-UNNAMED", "-jar", "app.jar"]
