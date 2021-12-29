FROM node:10-alpine

# Define Running Environment
ARG env="dev"

# Copy Source Code to Docker Container.
WORKDIR /frontend
COPY ./frontend .
COPY ./config/${env}.json ./src/auth_config.json

# Install Dependencies
RUN npm ci
RUN npm run build
RUN npm i serve -g

# Run the Application
EXPOSE 3000
CMD serve -s -n build