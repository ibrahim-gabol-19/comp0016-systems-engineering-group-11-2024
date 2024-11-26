Creating a React and Django application with a REST API involves setting up two main components:

1. **Frontend** (React)
2. **Backend** (Django + Django REST Framework)

We will structure it as a simple project with separate folders for the frontend and backend. Below is the guide for creating this setup:

---

### 1. Backend: Django + Django REST Framework

#### **Step 1: Setting Up Django Backend**

1. **Create a Virtual Environment for Django**:
   Open a terminal and create a virtual environment for your project:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows, use `env\Scripts\activate`
   ```

2. **Install Django and Django REST Framework**:
   ```bash
   pip install django djangorestframework
   ```

3. **Create a New Django Project**:
   ```bash
   django-admin startproject backend
   cd backend
   ```

4. **Create a New Django App**:
   ```bash
   python manage.py startapp api
   ```

5. **Add Installed Apps to `settings.py`**:
   In `backend/settings.py`, add the following to the `INSTALLED_APPS` list:
   ```python
   INSTALLED_APPS = [
       'django.contrib.admin',
       'django.contrib.auth',
       'django.contrib.contenttypes',
       'django.contrib.sessions',
       'django.contrib.messages',
       'django.contrib.staticfiles',
       'rest_framework',  # Add this line
       'api',  # Your app
   ]
   ```

6. **Set Up the API Models and Views**:
   In `api/models.py`, define a simple model:
   ```python
   from django.db import models

   class Item(models.Model):
       name = models.CharField(max_length=100)
       description = models.TextField()

       def __str__(self):
           return self.name
   ```

7. **Create a Serializer for the Model**:
   In `api/serializers.py`:
   ```python
   from rest_framework import serializers
   from .models import Item

   class ItemSerializer(serializers.ModelSerializer):
       class Meta:
           model = Item
           fields = '__all__'
   ```

8. **Create a View for the API**:
   In `api/views.py`:
   ```python
   from rest_framework import viewsets
   from .models import Item
   from .serializers import ItemSerializer

   class ItemViewSet(viewsets.ModelViewSet):
       queryset = Item.objects.all()
       serializer_class = ItemSerializer
   ```

9. **Set Up URLs for the API**:
   In `api/urls.py`:
   ```python
   from django.urls import path, include
   from rest_framework.routers import DefaultRouter
   from .views import ItemViewSet

   router = DefaultRouter()
   router.register(r'items', ItemViewSet)

   urlpatterns = [
       path('api/', include(router.urls)),
   ]
   ```

   In `backend/urls.py`, include the `api` URLs:
   ```python
   from django.contrib import admin
   from django.urls import path, include

   urlpatterns = [
       path('admin/', admin.site.urls),
       path('api/', include('api.urls')),  # Include your API URLs
   ]
   ```

10. **Run Migrations**:
    ```bash
    python manage.py migrate
    ```

11. **Run the Django Development Server**:
    ```bash
    python manage.py runserver
    ```

    Now, your backend API is running at `http://localhost:8000/api/items/`.

---

### 2. Frontend: React

#### **Step 2: Setting Up React Frontend**

1. **Create a React App**:
   In the root of your project directory, create a `frontend` directory and set up React:
   ```bash
   npx create-react-app frontend
   cd frontend
   ```

2. **Install Axios for API Requests**:
   We will use `axios` to make API calls to the backend.
   ```bash
   npm install axios
   ```

3. **Create a Simple React Component for Fetching Data**:

   In `frontend/src/App.js`, set up a simple React component that fetches data from the Django API:
   ```javascript
   import React, { useEffect, useState } from 'react';
   import axios from 'axios';

   const App = () => {
     const [items, setItems] = useState([]);

     useEffect(() => {
       axios.get('http://localhost:8000/api/items/')
         .then(response => {
           setItems(response.data);
         })
         .catch(error => {
           console.error('There was an error fetching the items!', error);
         });
     }, []);

     return (
       <div>
         <h1>Items List</h1>
         <ul>
           {items.map(item => (
             <li key={item.id}>{item.name} - {item.description}</li>
           ))}
         </ul>
       </div>
     );
   };

   export default App;
   ```

4. **Handle CORS (Cross-Origin Resource Sharing)**:
   Since the React app and Django API will run on different ports, we need to configure CORS in Django.

   - Install `django-cors-headers`:
     ```bash
     pip install django-cors-headers
     ```

   - Add `corsheaders` to `INSTALLED_APPS` in `backend/settings.py`:
     ```python
     INSTALLED_APPS = [
         # ...
         'corsheaders',
     ]
     ```

   - Add `CorsMiddleware` to the `MIDDLEWARE` list:
     ```python
     MIDDLEWARE = [
         # ...
         'corsheaders.middleware.CorsMiddleware',
     ]
     ```

   - Allow CORS for your frontend by adding this to `backend/settings.py`:
     ```python
     CORS_ALLOW_ALL_ORIGINS = True
     ```

5. **Run the React Development Server**:
   In the `frontend` directory, run:
   ```bash
   npm start
   ```

   Your React app should now be running on `http://localhost:3000`.

---

### 3. Final Directory Structure

```
project/
│
├── backend/  # Django backend
│   ├── api/
│   ├── backend/
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/  # React frontend
    ├── node_modules/
    ├── public/
    ├── src/
    ├── package.json
    └── package-lock.json
```

---

### 4. Testing the Application

1. Ensure your Django backend is running on `http://localhost:8000`.
2. Ensure your React frontend is running on `http://localhost:3000`.
3. In your browser, navigate to `http://localhost:3000`, and you should see the list of items fetched from the Django backend API.

### Conclusion

This setup gives you a basic React app that interacts with a Django backend using Django REST Framework. You can expand this by adding more pages, handling user authentication, and implementing other features like forms, etc.