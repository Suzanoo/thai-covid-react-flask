#!/bin/bash
exec gunicorn --config gunicorn_config.py src.wsgi:application ##