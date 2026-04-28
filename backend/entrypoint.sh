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
users = ['admin@admin.com', 'stayfinder@gmail.com', 'ron@gmail.com', 'user@gmail.com', 'ayushbholan@gmail.com']
password = 'test1234'
for email in users:
    try:
        u = User.objects.get(email=email)
        u.set_password(password)
        u.is_staff = True if email == 'admin@admin.com' else u.is_staff
        u.is_superuser = True if email == 'admin@admin.com' else u.is_superuser
        u.save()
        print(f'Password set for {email}')
    except User.DoesNotExist:
        print(f'User {email} not found')
"
python manage.py collectstatic --noinput

exec "$@"