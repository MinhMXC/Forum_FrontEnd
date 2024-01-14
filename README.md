# FORUM FRONTEND
[Backend](https://github.com/MinhMXC/Forum_BackEnd)

This is my personal project / CVWO Winter Assignment, done during 23-24 winter vacation.
The product is a forum that resembles Reddit.

Welcome to the Frontend Repository!

This is built using React Typescript and Material UI, with React Router v6.

## How to setup

Because the app is supposed to be run in conjunction with the [Backend](https://github.com/MinhMXC/Forum_BackEnd),
running it alone will not load any data and raise errors.

### IDE / Code Editor
1. Clone the repository.
2. Install Node.js, if you haven't.
3. CD into the project folder.
4. Run ```npm install``` to install all dependencies.
5. Run ```npm start``` to start the project in development mode. 

### Docker
1. The project comes with a Dockerfile that can be easily build into an image and run.

## Integration with Backend
1. This requires [Docker](https://www.docker.com/) and Docker Compose.
2. Clone both [Frontend](https://github.com/MinhMXC/ForumAPI_FrontEnd) and [Backend](https://github.com/MinhMXC/Forum_BackEnd)
into an empty folder.
3. Using VSCode or any editor, create a file docker-compose.yml in the folder.
4. Open docker-compose.yml, paste these codes into the file and save.
```yml
version: "3"

services:
  db:
    image: postgres:16.1
    volumes:
      - postgres:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: 123456abc
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: ./Forum_BackEnd
    volumes:
      - ./Forum_Backend:/usr/src/app
    ports:
      - 5000:5000
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./Forum_FrontEnd
    volumes:
      - ./Forum_FrontEnd:/usr/src/app
    ports:
      - 3000:3000
    depends_on:
      - backend

volumes:
  postgres:
```
5. Using the terminal, CD into the folder and run ```docker compose up```.
6. Wait a while for all the images to be built and run.
7. If there is no errors, the website will be hosted at localhost:3000 and can the Backend is exposed at localhost:5000.