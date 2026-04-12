# TechDepot

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/spring_boot-%236DB33F.svg?style=for-the-badge&logo=spring-boot&logoColor=white)
![Microsoft SQL Server](https://img.shields.io/badge/SQL_Server-CC292B?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

Every day I waste hours digging through boxes of tangled cables and random hardware. To fix that and as an excuse to learn and build my first modern full-stack project, I’m creating **TechDepot**: a stock management system to finally bring order to the chaos.

## 🛠️ Tech Stack

This project uses a decoupled architecture, separating the robust backend API from a dynamic, reactive user interface:

### Backend (RESTful API)
* **Language:** Java
* **Framework:** Spring Boot (v4.0.3)
* **Database:** Microsoft SQL Server
* **ORM:** Spring Data JPA & Hibernate
* **Architecture:** Layered pattern (Entities, Repositories, Services, and Controllers).

### Frontend (Single Page Application)
* **Library:** React (JavaScript)
* **Structure & Styling:** HTML5 & CSS3
* **Integration:** Consumes JSON data dynamically from the Spring Boot API endpoints.

## 🏗️ How it works

1. The **React Frontend** provides an interactive dashboard to view, add, and categorize hardware.
2. It sends HTTP requests (GET, POST, etc.) to the **Spring Boot Backend**.
3. The Backend validates the business rules in the **Services** layer and persists the data using **Repositories** into the **SQL Server** database.
