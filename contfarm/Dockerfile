FROM python:3.12-slim

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

COPY ./requirements.txt /usr/src/app/requirements.txt
RUN apt-get update && apt-get install -y build-essential g++
RUN pip install -r requirements.txt
RUN python -m spacy download en_core_web_sm

COPY ./entrypoint.sh /usr/src/app/entrypoint.sh
COPY . /usr/src/app/

ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]