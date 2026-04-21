FROM python:3.13-alpine

WORKDIR /usr/src/stayfinder_backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apk update && apk add --no-cache netcat-openbsd

RUN pip install --upgrade pip

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /usr/src/stayfinder_backend/entrypoint.sh
RUN chmod +x /usr/src/stayfinder_backend/entrypoint.sh

COPY . .

ENTRYPOINT ["/usr/src/stayfinder_backend/entrypoint.sh"]