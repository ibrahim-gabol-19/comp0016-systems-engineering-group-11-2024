#!/bin/bash
python manage.py migrate
gunicorn backend.wsgi --bind 0.0.0.0:8000