# <p align="center">🌟 EasyTrip 🌟</p>

<img width="2056" alt="Capture d’écran 2024-09-23 à 00 19 44" src="https://github.com/user-attachments/assets/6746ae09-df55-4d36-828b-55035fe63174">

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

## 🎥 Video

https://github.com/user-attachments/assets/11d6d0fe-43f3-47a0-9ef6-91bf7e3c8007

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

## 🏗️ Architectural Diagram

Here is an overview of the overall architecture of the EasyTrip application:

#### Data Flow

This diagram illustrates the flow of data in the application, from user interactions to the display of information on the screen.

<img width="1567" alt="Capture d’écran 2024-09-23 à 12 28 53" src="https://github.com/user-attachments/assets/9d418e4d-b543-4aa0-8d8b-c64442e82b56">

#### Description:

- **User:** Interacts with the front-end interface.
- **Front-end:** Sends requests to the back-end when an action is performed (for example, trip creation).
- **Back-end:** Processes requests according to the MVC model, accesses database data and calls external services.
- **Database:** Stores information about users, travel, hotels, etc.
- **External Services:** Enrich travel data with additional information (Google Places, GeoNames, Gemini).

## 🖼️ Mockup

Here are a few mock-ups of the EasyTrip application, illustrating the different pages and their layout.
![image](https://github.com/user-attachments/assets/d1e5f014-2dab-4395-97ea-99b5f70ebd4b)

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

<img width="200" alt="homepage" src="https://github.com/user-attachments/assets/3babe848-0658-4922-923a-c24612fc49bc"> <img width="200" alt="create-trip" src="https://github.com/user-attachments/assets/45318aff-e84a-4b0d-a85a-9bf97801ea85"> <img width="200" alt="Login" src="https://github.com/user-attachments/assets/eca97ce8-d86d-43fb-8fe1-cc2c1f3dcb82"> <img width="200" alt="signin" src="https://github.com/user-attachments/assets/2a994a12-d1db-4015-ac99-bd8a61624236"> <img width="200" alt="homepage connected" src="https://github.com/user-attachments/assets/b84f8471-9e89-42ef-a214-451707ce46b0"> <img width="200" alt="mes trips" src="https://github.com/user-attachments/assets/4f4c5624-5594-4c8e-842d-4566c26a574d"> <img width="200" alt="result 1" src="https://github.com/user-attachments/assets/1b92e2b7-e980-42d2-97a8-eec311169fa3"> <img width="200" alt="result 2" src="https://github.com/user-attachments/assets/8d508547-3857-4bbd-8089-eaf0e8d78c5f"> <img width="200" alt="myinfos" src="https://github.com/user-attachments/assets/f6c906e5-f420-4688-8fc7-a1e77e9650b5"> <img width="200" alt="updateData" src="https://github.com/user-attachments/assets/b3774ecd-591c-48aa-832d-9138655a4a3a"> <img width="200" alt="toast" src="https://github.com/user-attachments/assets/54849276-7283-4522-a66b-c9f8326b7e11">

## ✨ Main Features

- **Generate Personalized Itineraries:** Create travel itineraries tailored to your preferences, including suggestions for places to visit, activities to do and restaurants to discover.

- **Intuitive Destination Search:** Use the autocomplete search bar to quickly find popular destinations and points of interest.

- **Travel Management:** Create, view and delete your trips. View all the details of your route in one place.

- **Secure Authentication:** Easily sign in with your Google account or create a classic account to access all the features of the app.

- **Responsive And Design User Interface:** Enjoy a modern and fluid interface, optimized for use on all types of devices (computers, tablets, smartphones).

- **Profile Customization:** Manage your personal information and travel preferences for an even more personalized experience.

## 🤝 Contribute

Contributions are welcome! Here's how to proceed:

1. **Fork the repository:** Create a copy of the project on your GitHub account.
2. Clone the forked deposit on your local machine.
3. Create a branch for your feature or bug fix.
4. Make the necessary changes and make sure they meet project standards.
5. Open a Pull Request to submit your contribution.

Thank you for your help and your ideas! 🚀

## 📬 Contact

- LinkedIn Profile: [Mathieu Morel](https://www.linkedin.com/in/mathieumorel62/)
- Portfolio WebSite: [Mathieu Morel](https://mathieu-morel.netlify.app)
