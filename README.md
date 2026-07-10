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

Every day I waste hours digging through boxes of tangled cables and random hardware. To fix that and as an excuse to learn and build my first modern full-stack project, I'm creating **TechDepot**: a stock management system to finally bring order to the chaos.

---

## <img src="https://api.iconify.design/heroicons/wrench-screwdriver.svg?color=white" width="24" height="24" align="center"/> Tech Stack

This project uses a decoupled architecture, separating the robust backend API from a dynamic, reactive user interface:

### ✨ Key Features
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

TechDepot has been engineered for a **plug-and-play** development experience. You don't need to manually copy property files or run npm installs. Our automated scripts handle everything for you.

### 1. Database Setup (Run once)
We created a script to automate the entire SQL Server setup so **you don't need to open SQL Server Management Studio (SSMS)**. 

If you have **SQL Server Express** installed, simply run the setup script **as Administrator**:

```powershell
# Open PowerShell as Administrator and run:
./setup-sqlserver.ps1
```

**What this does automatically:**
- Enables TCP/IP connections on port 1433 (required by Java/Spring Boot).
- Starts the SQL Server and SQL Browser services.
- Connects to SQL Server silently and executes `/database/TechDepotTablesQuery.sql` to generate the database and default data.

*(If you prefer not to use the script, you can always open SSMS and execute the SQL file manually).*

### 2. Configure Database Password (Mandatory)

By default, Java needs your SQL Server credentials to connect safely. 
1. Run `./dev.ps1` for the first time. It will auto-generate a file located at:
   `td-backend/src/main/resources/application.properties`
2. Open that file and set your SQL Server user and password:
```properties
spring.datasource.username=sa
spring.datasource.password=tu_contraseña_aqui
```
*(Tip: `sa` is the default System Administrator user in SQL Server).*

### 3. Frontend Permissions (Windows Users)

If you encounter a **"scripts is disabled on this system"** error when running the frontend, it's due to PowerShell's default security policy. Fix it by running this in an Administrator PowerShell:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
*(Press `Y` or `S` to accept).*

---

## <img src="https://api.iconify.design/heroicons/play.svg?color=white" width="24" height="24" align="center"/> Running the Project

To start both the Backend and Frontend simultaneously with zero hassle:

```powershell
# From the project root directory:
./dev.ps1
```

**The `dev.ps1` script will automatically:**
1. ⚙️ **Configure Environment:** Create `application.properties` from the `.example` template if it doesn't exist.
2. 📦 **Install Dependencies:** Detect if the frontend is missing `node_modules` and run `npm install` automatically.
3. 🚀 **Launch Backend:** Start the Spring Boot API on `http://localhost:8080`.
4. 🚀 **Launch Frontend:** Start the Vite React app on `http://localhost:5173`.

Everything will open in separate background terminal windows. You can close the main script window once they launch.

### Manual Configuration (Optional)
If you prefer not to use Windows Integrated Authentication or have a specific SQL Server user, you can manually edit `td-backend/src/main/resources/application.properties` after the first run:
```properties
spring.datasource.username= YOUR_USER
spring.datasource.password= YOUR_PASSWORD
```

---

## <img src="https://api.iconify.design/heroicons/exclamation-triangle.svg?color=white" width="24" height="24" align="center"/> Troubleshooting

<details>
<summary><strong>Connection refused on port 1433</strong></summary>

This means SQL Server is not listening on TCP/IP port 1433. Solutions:
1. **If you have SQL Server Express:** Use `instanceName=SQLEXPRESS` in the URL instead of port `1433`. See *Option A* above.
2. **If you need port 1433:** Enable TCP/IP in SQL Server Configuration Manager and restart the service.
3. Make sure the SQL Server service is running: `Get-Service MSSQL*`
</details>

<details>
<summary><strong>"Unable to determine Dialect" error</strong></summary>

This cascading error happens when Hibernate can't connect to the database. Fix the connection first (see above). The `application.properties.example` already includes the explicit dialect to prevent this error.
</details>

<details>
<summary><strong>SQL Server Browser won't start</strong></summary>

The Browser service might be set to "Disabled". Change it with:
```powershell
Set-Service SQLBrowser -StartupType Manual
Start-Service SQLBrowser
```
</details>
