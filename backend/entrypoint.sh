#!/bin/sh

if [ "$DATABASE" = "postgres" ] && [ -n "$SQL_HOST" ] && [ -n "$SQL_PORT" ]; then
  echo "Waiting for PostgreSQL at $SQL_HOST:$SQL_PORT..."
  while ! nc -z $SQL_HOST $SQL_PORT; do
    sleep 0.1
  done
  echo "Database is up and running :)"
fi

python manage.py migrate --run-syncdb
python manage.py shell -c "from property.models import Property; print(Property.objects.count())" | grep -q "^0$" && python manage.py loaddata data_clean.json || true
python manage.py shell -c "
from useraccount.models import User
u, created = User.objects.get_or_create(email='admin@admin.com')
u.set_password('admin123')
u.is_staff = True
u.is_superuser = True
u.save()
print('Superuser ready')
"
python manage.py collectstatic --noinput

exec "$@"