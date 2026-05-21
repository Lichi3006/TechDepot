<p align="center">
  <img src="media/logo.svg" alt="TechDepot Logo" width="250">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Work--In--Progress-orange" alt="Status">
  <img src="https://img.shields.io/badge/Stage-Alpha-yellow" alt="Stage">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white" alt="Hibernate">
  <img src="https://img.shields.io/badge/SQL_Server-CC292B?style=for-the-badge&logo=microsoft&logoColor=white" alt="SQL Server">  <img src="https://img.shields.io/badge/spring_boot-%236DB33F.svg?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React">
  <img src="https://img.shields.io/badge/typescript-%23323330.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
</p>

Every day I waste hours digging through boxes of tangled cables and random hardware. To fix that and as an excuse to learn and build my first modern full-stack project, I’m creating **TechDepot**: a stock management system to finally bring order to the chaos.

---

## <img src="https://api.iconify.design/heroicons/wrench-screwdriver.svg?color=white" width="24" height="24" align="center"/> Tech Stack

This project uses a decoupled architecture, separating the robust backend API from a dynamic, reactive user interface:

### Backend (RESTful API)
* **Language:** Java 21
* **Framework:** Spring Boot (v4.0.3)
* **Database:** Microsoft SQL Server
* **ORM:** Spring Data JPA & Hibernate
* **Architecture:** Layered pattern (Entities, Repositories, Services, and Controllers).

### Frontend (Single Page Application)
* **Library:** React (TypeScript)
* **Structure & Styling:** HTML5 & CSS3
* **Integration:** Consumes JSON data dynamically from the Spring Boot API endpoints.

---

## <img src="https://api.iconify.design/heroicons/document-check.svg?color=white" width="24" height="24" align="center"/> Prerequisites

Before you start, make sure you have the following installed:

* **JDK 21:** The version required to compile and run the backend.
* **Node.js (v18+) & npm:** Essential to run the React development server.
* **Microsoft SQL Server:** Either Express or Developer edition.
* **SQL Server Management Studio (SSMS):** To run the database scripts easily.
* **An IDE:** I recommend **IntelliJ IDEA** for the backend and **Web Storm** for the frontend.

## <img src="https://api.iconify.design/heroicons/key.svg?color=white" width="24" height="24" align="center"/> Key Dependencies

### Backend (Maven)
* **Spring Data JPA:** To handle all the database magic without writing raw SQL for everything.
* **Hibernate:** The underlying Object-Relational Mapping (ORM) framework that maps Java entities to SQL Server tables, handles query generation, and manages object state transitions.
* **MSSQL Driver:** The bridge between Java and SQL Server.
* **Lombok:** To keep our entities clean (no more manual Getters and Setters!).
* **Spring Web:** To build the REST API endpoints.

### Frontend (npm)
* **React & TypeScript:** For a type-safe and component-based UI.
* **Axios:** To handle all HTTP communication with the backend.
* **Lucide React:** (Optional but recommended) For those clean, modern icons.

---

## <img src="https://api.iconify.design/heroicons/cog-6-tooth.svg?color=white" width="24" height="24" align="center"/> How it works

1. The **React Frontend** provides an interactive dashboard to view, add, and categorize hardware.
2. It sends HTTP requests (GET, POST, etc.) to the **Spring Boot Backend**.
3. The Backend validates the business rules in the **Services** layer and persists the data using **Spring Data JPA & Hibernate** into the **SQL Server** database.

## <img src="https://api.iconify.design/heroicons/arrow-down-tray.svg?color=white" width="24" height="24" align="center"/> Local Setup & Configuration

To protect sensitive credentials, the main configuration file is not included in this repository. Follow these steps to set up the project locally:

### 1. Database Setup
1. Open **Microsoft SQL Server Management Studio (SSMS)**.
2. Run the script located at `/database/TechDepotTablesQuery.sql` to generate the schema and constraints and creating the database `TechDepot` in the process.

### 2. Environment Configuration
1. Navigate to `td-backend/src/main/resources/`.
2. Locate the file `application.properties.example`.
3. Create a copy of that file in the same folder and rename it to **`application.properties`**.
4. Open the new `application.properties` and replace the placeholders with your local SQL Server credentials:
   ```properties
   spring.datasource.username= YOUR_USER
   spring.datasource.password= YOUR_PASSWORD
