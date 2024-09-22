# <p align="center">🌟 EasyTrip 🌟</p>

## 📝 Description
EasyTrip is an innovative web application that allows you to plan trips in a simple and efficient way. Through the use of artificial intelligence, EasyTrip generates personalized itineraries based on the user's preferences, such as destination, budget, length of stay and desired activities. The application also offers complete management of past and future trips as well as an intuitive interface to offer a smooth and pleasant planning experience. EasyTrip simplifies the organization of road trips by providing tailor-made recommendations, all accessible from a single platform.

## 📚 Resources
- **[React-icons](https://react-icons.github.io/react-icons/)**
- **[Emojipedia](https://emojipedia.org)**
- **[Gemini](https://ai.google.dev)**
- **[GeoNames](https://www.geonames.org/export/web-services.html)**
- **[Vite](https://vitejs.dev)**
- **[React Documentation](https://legacy.reactjs.org)**
- **[Node.js](https://nodejs.org/fr)**
- **[Tailwind](https://tailwindcss.com)**
- **[API Google Places](https://developers.google.com/maps/documentation/places/web-service/overview)**
- **[Express.js](https://expressjs.com/)**
- **[Shadcn/ui](https://ui.shadcn.com)**
- **[MySQL](https://dev.mysql.com/doc/)**
- **[JSON Web Tokens (JWT)](https://jwt.io/introduction/)**
- **[Axios](https://axios-http.com/docs/intro)**
- **[OAuth](https://oauth.net/)**
- **[Jest](https://jestjs.io/docs/getting-started)**

## 🛠️ Technologies et Outils Utilisés

EasyTrip uses a variety of modern technologies to provide a smooth and high-performance user experience. Here are the main technologies used in the project:

- **Frontend :**

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

- **Backend :**

  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) 
  
- **Database :**

  ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)  

- **Tests :**

  ![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

## 🚀 Installation and Configuration

Follow these steps to install and configure EasyTrip on your local machine:

### Prerequisites

- Node.js (version 18 or higher) and npm installed on your machine.

- MySQL installed and configured.

### Installation

#### 1. Clone the deposit:

  ```bash
  git clone https://github.com/MathieuMorel62/EasyTrip.git
  ```

#### 2. Install the frontend and backend dependencies:

  For the frontend:

  ```bash
  npm install
  ```
    
  For the backend:

  ```bash
  cd backend
  npm install
  ```

#### 3. Database configuration:

- Create a MySQL database for the application.
- Import the [easyTripDb.sql](https://github.com/MathieuMorel62/EasyTrip/blob/main/easyTripDb.sql) file into your database.

```sql
mysql -u [your-user] -p [your-database] < easyTripDb.sql
```

#### 4. Configuration of environment variables:

Create a `.env` file in the `frontend` and `backend` directories using the `.env.example` examples provided. Fill in the necessary information, such as database identifiers, API keys, etc.

#### 5. Start the development server:

For the frontend:

```bash
npm run dev
```

For the backend:

```bash
cd backend
npm start
```

#### 6. Access the application:

Open your browser and navigate to `http://localhost:5173` to access the frontend.

### Tests

To run the tests with Jest, use the following command:

```bash
npm test
```

## 💡 Use

- Create an account or log in
  - Open the application and create a new account using your email, or log in using your Google account for quick access.

- Create a trip
  - Click on the `Create a Trip` button.
  - Fill in the necessary information: `destination`, `budget`, `length of stay`, `number of travellers`.
  - Validate to generate a personalized route.

- View and manage trips
  - Go to the `My Trips` section to view all your trips.
  - Click on a trip to see the details, change the information or delete the trip if necessary.

- Customize your profile
  - Go to the `Profile` section to update your personal information, such as your name, email or password.


## 📸 Screenshots

## 📞 Contact