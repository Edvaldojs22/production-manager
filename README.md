<table border="0">
  <tr>
    <td width="250px" align="center" valign="middle">
      <img src="./frontend/src/assets/images/logoAF.png" alt="AutoFlex Logo" width="200px">
    </td>
    <td valign="middle">
      <h1>🚀 AutoFlex</h1>
      <h3>Manufacturing Management System</h3>
      <p>A high-performance solution for industrial inventory and production intelligence.</p>
      <a href="https://www.oracle.com/java/"><img src="https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk" alt="Java"></a>
      <a href="https://spring.io/projects/spring-boot/"><img src="https://img.shields.io/badge/Spring%20Boot-3-green?style=for-the-badge&logo=springboot" alt="Spring Boot"></a>
      <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React"></a>
      <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql" alt="MySQL"></a>
    </td>
  </tr>
</table>

> **Overview:** AutoFlex is a comprehensive solution for raw material inventory control and industrial product composition management. The system allows for input registration, technical recipe assembly, and offers production intelligence based on available stock, prioritizing profitability.

---

## 🛠️ Tech Stack

| Back-end (API)              | Front-end (Web)          |
| --------------------------- | ------------------------ |
| **Java 17 & Spring Boot 3** | **React 19 & Vite**      |
| Spring Data JPA             | Tailwind CSS 4           |
| MySQL Database              | React Router Dom 7       |
| Validation & Lombok         | Axios, Lucide & Toastify |

---

## 💡 Key Features

- 🔍 **Intelligent Input Search**: SKU-based search to speed up composition assembly.
- ⚡ **Optimized State Management**: Grouped states in React to reduce unnecessary re-renders.
- 💰 **Production Prioritization**: Algorithm suggests production based on **highest unit value**, maximizing profit.
- 📱 **Responsive Design**: Fully adapted for Mobile and Desktop environments.

---

## 📋 Requirements Met

- ✅ **Product CRUD**: Sales value and SKU management.
- ✅ **Raw Material CRUD**: Full inventory control.
- ✅ **Stock Updates**: Easy level adjustments.
- ✅ **Technical Composition**: Link materials to finished products.
- ✅ **Production Suggestion**: "What can I build now?" logic.

---

## ⚙️ Installation & Setup

### ☕ Back-end Setup

1. Ensure you have **Java 17** and **Maven** installed.
2. Configure the database in `src/main/resources/application.properties` with your MySQL credentials.
3. Run the server:

mvn spring-boot:run

Código

---

### ⚛️ Front-end Setup

1. Navigate to the frontend folder and install dependencies:

   cd frontend <br>
   npm install

2. Create a `.env` file in the root of the frontend folder:

   VITE_API_URL=http://localhost:8080

3. Launch the application:

   npm run dev

---

## 🧪 API Validation

The project includes `.http` request files in `src/test/resources` for quick validation.  
You can use the **REST Client (VS Code)** or **IntelliJ HTTP Client** to:

- Test CRUD operations.
- Validate the production algorithm directly from your IDE.

---

<div align="center">

**Developed for the AutoFlex Technical Challenge**  
_Standardized in English for international technical compliance._

</div>
