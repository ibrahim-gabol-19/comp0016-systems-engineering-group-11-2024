# comp0016-systems-engineering-group-11-2024

# Backend
- Make sure your python version is 3.10 or 3.11 
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
- - Check htmlcov folder for index.html to view coverage
### Linting
- `pylint --load-plugins pylint_django **/*.py`

## Documentation
- Available at pdocs/index.html
- To rebuild: `pdoc  accounts/ backend/ articles/ events/ api/ comments/ companyinformation/ exampledata/ forums/ likes/ reportdiscussion/ reports/ search/  --output-dir pdocs`
- Any further created apps should also be included in the pdoc command (e.g: following on from `search/`)
# Frontend

## Run Development
- Make sure you have nodejs install (whatever OS you are using)
- Duplicate `.env.example` in `frontend/` and rename it to `.env`
- `cd frontend`
- `npm install tailwindcss`
- `npm install tailwind`
- `npm install`
- `npm start`


## Tests

### Unit Tests
- `npm run test`
### Coverage Report
- `npm run coverage`
- Check coverage folder for index.html to view coverage
### Linting
- `npx eslint src --max-warnings=0`
