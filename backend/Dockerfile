FROM python:3.13-alpine

WORKDIR /usr/src/stayfinder_backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
# build-base, g++, and musl-dev are required to compile scikit-learn/numpy
RUN apk update && apk add --no-cache \
    netcat-openbsd \
    build-base \
    g++ \
    musl-dev \
    python3-dev \
    postgresql-dev \
    libffi-dev

# Upgrade pip
RUN pip install --upgrade pip

# Copy and install Python dependencies
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy and prepare entrypoint script
COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /usr/src/stayfinder_backend/entrypoint.sh
RUN chmod +x /usr/src/stayfinder_backend/entrypoint.sh

# Copy project files
COPY . .

# Run the entrypoint
ENTRYPOINT ["/usr/src/stayfinder_backend/entrypoint.sh"]