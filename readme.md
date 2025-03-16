# TaskMaster - Full Stack To-Do List Application

TaskMaster is a fully functional To-Do List Web Application with user authentication, task management, and profile picture upload functionality. The application features a user-friendly interface built with Next.js and Tailwind CSS on the frontend, and Django REST Framework with MySQL on the backend.


<img width="1280" alt="Screenshot 2025-03-17 at 03 07 06" src="https://github.com/user-attachments/assets/e4c00faf-ac7b-4eec-95d9-0cbd9c7d634a" />


## Features

- **User Authentication**
  - Secure sign up and sign in functionality
  - JWT-based authentication
  - Password hashing and secure storage

- **Task Management**
  - Create, edit, update, and delete tasks
  - Mark tasks as completed/incomplete
  - Separate views for current and completed tasks
  - Task creation and completion date tracking

- **Profile Management**
  - Profile picture upload and display
  - User profile information display
  - Secure image storage

- **Responsive Design**
  - Mobile-friendly interface
  - Clean, modern UI with Tailwind CSS
  - Professional styling with shadcn/ui components

## Technologies Used

### Frontend
- Next.js 14 (React framework with TypeScript)
- Tailwind CSS (Styling)
- shadcn/ui (UI components)
- JWT for authentication
- date-fns for date formatting

### Backend
- Django 4.2
- Django REST Framework
- Simple JWT for authentication
- SQLite3 database
- Pillow for image processing

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git



### Backend Setup (Django)

1. Clone the repository
```bash
git clone https://github.com/Arman170616/taskmaster.git
cd todo-app/backend
```

2. Create a virtual environment
```bash
python -m venv venv
```
3. Activate the virtual environment   
```bash
source venv/bin/activate
```
4. Install dependencies
```bash
pip install -r requirements.txt
```
5. Run migrations
```bash
python manage.py migrate
```
6. Create a superuser (admin)
```bash
python manage.py createsuperuser
```
7. or using existing user
```bash
username: ArmanHossain
pass: 1
```
8. Start the development server
```
python manage.py runserver
The backend API will be available at http://localhost:8000/api/
```
*Note: If you want to use MySQL, you need to change the database settings in settings.py and run the following command*
```bash
python manage.py migrate
```




## API Endpoints
```


### Authentication

- `POST /api/register/` - Register a new user
- `POST /api/token/` - Get JWT tokens
- `POST /api/token/refresh/` - Refresh JWT token


### User Profile

- `GET /api/profile/` - Get user profile
- `POST /api/create-profile/` - Create user profile if it doesn't exist
- `POST /api/upload-profile-picture/` - Upload profile picture


### Tasks

- `GET /api/tasks/` - List tasks (query param: ?completed=true/false)
- `POST /api/tasks/` - Create a new task
- `GET /api/tasks/{id}/` - Get a specific task
- `PATCH /api/tasks/{id}/` - Update a task
- `DELETE /api/tasks/{id}/` - Delete a task
```



### Frontend Setup (Next.js)

1. Navigate to the frontend directory
```
cd ..
```
2. Install dependencies
```
npm install
### If not work, Run
npm install --legacy-peer-deps
```
3. Start the development server
```
npm run dev
The frontend application will be available at http://localhost:3000
```

Contact with me: armanicepust9@gmail.com

Happy Coding <3
