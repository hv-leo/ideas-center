docker build --rm -f ./backend/Dockerfile -t ideas-center-backend . --build-arg env=dev
docker build --rm -f ./frontend/Dockerfile -t ideas-center-frontend . --build-arg env=dev

docker run --init -d -p 3001:3001 -it ideas-center-backend
docker run --init -d -p 3000:3000 -it ideas-center-frontend
