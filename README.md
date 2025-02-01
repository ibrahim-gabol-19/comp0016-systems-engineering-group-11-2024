# comp0016-systems-engineering-group-11-2024

## Backend Development Setup 
- WIP
- See frontendbackendsetup.md
### Coverage test backend
`coverage run manage.py test`
`coverage html --omit="*/test*"  -i`

### Backend linting
`pylint --load-plugins pylint_django **/*.py`

## Frontend Development Setup
- Make sure you have nodejs install (whatever OS you are using)
- `cd frontend`
- `npm install tailwindcss`
- `npm install tailwind`
- `npm install`
- `npm start`
### Frontend Linting
`npm run lint`