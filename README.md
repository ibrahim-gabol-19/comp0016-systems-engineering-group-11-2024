# comp0016-systems-engineering-group-11-2024

# Backend

## Run Development
- `cd backend`
- `python -m venv venv`
- `pip install -r requirements.txt`
- `python manage.py makemigrations`
- `python manage.py migrate`
- `python manage.py runserver`
- Backend should be up at the `127.0.0.1:8000`

## Tests

### Unit Tests
- `python manage.py test`
### Coverage Report
- `coverage run manage.py test`
- `coverage html --omit="*/test*"  -i`

### Linting
- `pylint --load-plugins pylint_django **/*.py`

# Frontend

## Run Development
- Make sure you have nodejs install (whatever OS you are using)
- `cd frontend`
- `npm install tailwindcss`
- `npm install tailwind`
- `npm install`
- `npm start`


## Tests

### Unit Tests
- *(To be implemented)*
### Coverage Report
- *(To be implemented)*
### Linting
- `npm run lint`
