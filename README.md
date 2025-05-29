
# Django + React Project Setup Guide

This guide walks you through setting up a full-stack project with a Django backend and a React frontend. It includes instructions for cloning the repository, configuring environment variables, installing dependencies, and running the servers.

---

## 🧾 Prerequisites

Before you begin, ensure you have the following installed on your system:

- Python 3.8+
- pip (Python package installer)
- Node.js and npm
- Git
- A virtual environment tool like `venv`, `virtualenv`, or `pipenv`
- PostgreSQL 
- **Optional:** Docker & Docker Compose (if containerization is desired)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Wesley534/farm_management_sys.git
cd farm_management_sys
```

---

## 🔧 Backend Setup (Django)

### 2. Navigate to the Backend Directory

```bash
cd farm-management
```

### 3. Create and Activate a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate        # On Windows use: venv\Scripts\activate
```

### 4. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

Create a `.env` file in the `farm-management` directory using the .env.example file provided



> **Note:** Never commit your `.env` file to version control. Ensure `.gitignore` includes `.env`.

### 6. Apply Migrations and Create a Superuser

```bash
python manage.py migrate
python manage.py createsuperuser
```

Follow the prompts to set up an admin user.

### 7. Run the Django Development Server

```bash
python manage.py runserver
```

The backend will be accessible at: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## 🌐 Frontend Setup (React)

### 8. Navigate to the Frontend Directory

```bash
cd ../fms
```

### 9. Install Node Modules

```bash
npm install
```



### 10. Start the React Development Server

```bash
npm run dev
```

The frontend will run at: [http://localhost:5173/](http://localhost:5173/)

---




## 🛠 Troubleshooting

- **Virtual environment not activating?**
  - On Windows, use PowerShell or CMD: `venv\Scripts\activate`
- **Frontend can't access backend API?**
  - Check the value of `REACT_APP_API_URL`
  - Make sure Django is running
- **Migrations failing?**
  - Ensure your database is set up and credentials are correct in `.env`
- **CORS errors?**
  - Double-check `CORS_ALLOWED_ORIGINS` in Django settings

---

## 📬 Contact

For questions, suggestions, or issues, feel free to reach out:  
📧 [peterwesley484@gmail.com](mailto:peterwesley484@gmail.com)  
