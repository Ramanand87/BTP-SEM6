pip freeze > requirements.txt
venv/Scripts/activate 
docker-compose up -d --build
docker-compose down
docker exec -it django /bin/sh
uvicorn core.asgi:application --port 8000 --workers 4 --log-level debug --reload