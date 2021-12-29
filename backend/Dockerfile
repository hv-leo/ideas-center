FROM node:10-alpine

# Define Running Environment
ARG env="dev"

# Copy Source Code to Docker Container.
WORKDIR /backend
COPY ./backend .
COPY ./config/${env}.json ./auth_config.json

# Install Dependencies
RUN npm ci

# Run the Application
EXPOSE 3001
CMD npm run start