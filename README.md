<p align="center">
  <img src="media/logo.svg" alt="TechDepot Logo" width="250">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Work--In--Progress-orange" alt="Status">
  <img src="https://img.shields.io/badge/Stage-Alpha-yellow" alt="Stage">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/spring_boot-%236DB33F.svg?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/SQL_Server-CC292B?style=for-the-badge&logo=microsoft-sql-server&logoColor=white" alt="Microsoft SQL Server">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React">
  <img src="https://img.shields.io/badge/typescript-%23323330.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
</p>

Every day I waste hours digging through boxes of tangled cables and random hardware. To fix that and as an excuse to learn and build my first modern full-stack project, I’m creating **TechDepot**: a stock management system to finally bring order to the chaos.

---

## <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24" style="vertical-align: middle; display: inline-block; margin-right: 8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" /></svg> Tech Stack

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

## <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24" style="vertical-align: middle; display: inline-block; margin-right: 8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" /></svg> Prerequisites

Before you start, make sure you have the following installed:

* **JDK 21:** The version required to compile and run the backend.
* **Node.js (v18+) & npm:** Essential to run the React development server.
* **Microsoft SQL Server:** Either Express or Developer edition.
* **SQL Server Management Studio (SSMS):** To run the database scripts easily.
* **An IDE:** I recommend **IntelliJ IDEA** for the backend and **Web Storm** for the frontend.

## <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24" style="vertical-align: middle; display: inline-block; margin-right: 8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg> Key Dependencies

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

## <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24" style="vertical-align: middle; display: inline-block; margin-right: 8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg> How it works

1. The **React Frontend** provides an interactive dashboard to view, add, and categorize hardware.
2. It sends HTTP requests (GET, POST, etc.) to the **Spring Boot Backend**.
3. The Backend validates the business rules in the **Services** layer and persists the data using **Spring Data JPA & Hibernate** into the **SQL Server** database.

## <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24" style="vertical-align: middle; display: inline-block; margin-right: 8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" /></svg> Local Setup & Configuration

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
   ```

---

## <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24" style="vertical-align: middle; display: inline-block; margin-right: 8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg> How to Run (Unified Runner)

To simplify development, I’ve created scripts that launch both the Backend and the Frontend simultaneously in separate terminal windows:

*   **Windows (Double click):** Run the `dev.bat` file at the root of the project.  
*   **PowerShell:** Run `./dev.ps1` from the root.  

This will start:  

*   **Backend**: `http://localhost:8080`
*   **Frontend**: `http://localhost:5173` (Vite)

---
