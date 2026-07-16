<p align="center">
  <img src="media/logo.svg" alt="TechDepot Logo" width="250">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Edition-Standalone_Portable-purple" alt="Edition">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/spring_boot-%236DB33F.svg?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React">
  <img src="https://img.shields.io/badge/typescript-%23323330.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
</p>

> ⚠️ **BRANCH NOTICE:** This is the `feature/sqlite-standalone` branch. It is designed to generate a 100% portable `.jar` executable that embeds the frontend and uses an auto-generated local **SQLite** database. **No Docker or SQL Server is required.** For the Enterprise/Server version, switch back to the `main` branch.

TechDepot is an open-source hardware and inventory management system optimized for IT departments and workshops, featuring native mobile QR scanning capabilities.

---

## <img src="https://api.iconify.design/heroicons/wrench.svg?color=white" width="24" height="24" align="center"/> Building the Portable Version

To generate the standalone executable, you only need Java and Node.js installed on your machine.

Run the provided build script from the root of the project:

```powershell
# Open PowerShell and run:
./build-standalone.ps1
```

**What this script does:**
1. Compiles the React frontend into static HTML/JS files.
2. Injects the frontend seamlessly into the Spring Boot backend.
3. Compiles the Java backend into a single `TechDepot-Portable.jar` file.

---

## <img src="https://api.iconify.design/heroicons/play.svg?color=white" width="24" height="24" align="center"/> Running the Application

> [!WARNING]
> **Did you just download this branch?** Compiled `.jar` files are not stored in GitHub. You **MUST** run `./build-standalone.ps1` at least once to build the project before trying to run it!

Once built, you can distribute the `.jar` file alongside the `Run.bat` file to any computer. The end-user **only needs Java installed**.

To start the application, simply double-click:
**`Run.bat`**

### What happens in the background?
1. The server will start on port `8080`.
2. An SQLite database (`techdepot.db`) will be automatically created in the same folder.
3. The database will automatically populate itself with the seed data (Ports, Colors, Categories, etc.).
4. Your default web browser will automatically open at `http://localhost:8080`.

To stop the server, simply press `CTRL + C` in the terminal window or close it.
