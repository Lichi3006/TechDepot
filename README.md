<p align="center">
  <img src="media/logo.svg" alt="TechDepot Logo" width="250">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Stage-Beta-blue" alt="Stage">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white" alt="Hibernate">
  <img src="https://img.shields.io/badge/SQL_Server-CC292B?style=for-the-badge&logo=microsoft&logoColor=white" alt="SQL Server">  <img src="https://img.shields.io/badge/spring_boot-%236DB33F.svg?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React">
  <img src="https://img.shields.io/badge/typescript-%23323330.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
</p>

Every day I waste hours digging through boxes of tangled cables and random hardware. To fix that and as an excuse to learn and build my first modern full-stack project, I'm creating **TechDepot**: a stock management system to finally bring order to the chaos.

---

## <img src="https://api.iconify.design/heroicons/wrench-screwdriver.svg?color=white" width="24" height="24" align="center"/> Tech Stack

This project uses a decoupled architecture, separating the robust backend API from a dynamic, reactive user interface:

### Key Features
* **Smart QR Code Scanner:** Rapid inventory lookup via mobile camera, scanning custom QR UUIDs attached to physical containers.
* **Mobile-First Responsive UI:** Seamlessly switches from a desktop data-table to modern, MercadoLibre-style item cards on mobile devices.
* **Advanced Filtering & Search:** Dynamic sidebar to filter hardware by categories, brands, ports, protocols, and more.
* **Robust Hardware Management:** Full CRUD operations for complex metadata like cables, ports, adapters, and custom specifications.

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

Because TechDepot is fully containerized, you **do not** need to manually install Java, Node.js, or SQL Server. You only need:

* **[Docker Desktop](https://www.docker.com/products/docker-desktop/):** Required to run the containers.
* **Git:** To clone the repository.

## <img src="https://api.iconify.design/heroicons/key.svg?color=white" width="24" height="24" align="center"/> Key Dependencies

### Backend (Maven)
* **Spring Data JPA:** To handle all the database magic without writing raw SQL for everything.
* **Hibernate:** The underlying Object-Relational Mapping (ORM) framework that maps Java entities to SQL Server tables, handles query generation, and manages object state transitions.
* **MSSQL Driver:** The bridge between Java and SQL Server.
* **Lombok:** To keep our entities clean (no more manual Getters and Setters!).
* **Spring Web:** To build the REST API endpoints.

### Frontend (npm)
* **React & TypeScript:** For a type-safe and component-based UI.
* **React Router DOM:** Manages the entire Single Page Application (SPA) navigation and routing.
* **Axios:** To handle all HTTP communication with the backend.
* **HTML5-QRCode:** Powers the native mobile camera integration for reading QR codes.
* **React Colorful:** Provides the sleek hexadecimal color picker used in the admin panel.
* **Vite Basic SSL Plugin:** Generates local HTTPS certificates instantly so the mobile browser can request Camera permissions during local development.

---

## <img src="https://api.iconify.design/heroicons/cog-6-tooth.svg?color=white" width="24" height="24" align="center"/> How it works

1. The **React Frontend** provides an interactive dashboard to view, add, and categorize hardware.
2. It sends HTTP requests (GET, POST, etc.) to the **Spring Boot Backend**.
3. The Backend validates the business rules in the **Services** layer and persists the data using **Spring Data JPA & Hibernate** into the **SQL Server** database.

## <img src="https://api.iconify.design/heroicons/arrow-down-tray.svg?color=white" width="24" height="24" align="center"/> Local Setup & Configuration

TechDepot has been engineered for a **plug-and-play** development experience via Docker.

### <img src="https://api.iconify.design/heroicons/cube.svg?color=white" width="20" height="20" align="center"/> Quick Start

The fastest way to get everything running. **You only need [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.**

```bash
# Clone the repository
git clone https://github.com/Lichi3006/TechDepot.git
cd TechDepot

# Launch everything (SQL Server + Backend + Frontend)
docker compose up -d
```

That's it. On the first run, Docker will:
1. Download and start **SQL Server 2022 Express** automatically.
2. **Create the database** and seed it with initial data (tables, ports, brands, etc.).
3. **Compile and launch** the Spring Boot backend.
4. **Build and serve** the React frontend via Nginx.

| Service  | URL                     |
|----------|-------------------------|
| Frontend | http://localhost:5173   |
| Backend  | http://localhost:8080   |
| SQL Server | `localhost:1433` (user: `sa` / pass: `TechDepot2026!`) |

**Useful commands:**
```bash
docker compose down        # Stop all services
docker compose down -v     # Stop and delete database (full reset)
docker compose logs -f     # Watch live logs
```

> **Note:** The first build takes a few minutes while Docker downloads images and compiles the code. Subsequent starts are near-instant.


