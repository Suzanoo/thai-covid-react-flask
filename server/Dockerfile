FROM python:3.10-slim

# install non-Python dependency:
RUN apt-get update && apt-get -y upgrade \
 && apt-get install -y --no-install-recommends \
    git \
    wget \
    g++ \
    gcc \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ADD . /app

# install dependencies
WORKDIR /app/src
RUN pip install gunicorn
RUN python setup.py install
RUN pip install -e .

WORKDIR /app

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["sh", "entrypoint.sh"]