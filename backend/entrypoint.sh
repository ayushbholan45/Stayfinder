#!/bin/sh

if [ "$DATABASE" = "postgres" ] && [ -n "$SQL_HOST" ] && [ -n "$SQL_PORT" ]; then
  echo "Waiting for PostgreSQL at $SQL_HOST:$SQL_PORT..."
  while ! nc -z $SQL_HOST $SQL_PORT; do
    sleep 0.1
  done
  echo "Database is up and running :)"
fi

python manage.py migrate --run-syncdb
python manage.py collectstatic --noinput

exec "$@"