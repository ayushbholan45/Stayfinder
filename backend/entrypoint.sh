#!/bin/sh

# Only wait for DB in local dev where SQL_HOST and SQL_PORT are explicitly set
if [ "$DATABASE" = "postgres" ] && [ -n "$SQL_HOST" ] && [ -n "$SQL_PORT" ]; then
  echo "Waiting for PostgreSQL at $SQL_HOST:$SQL_PORT..."
  while ! nc -z $SQL_HOST $SQL_PORT; do
    sleep 0.1
  done
  echo "Database is up and running :)"
fi

python manage.py migrate --fake-initial
python manage.py collectstatic --noinput

exec "$@"