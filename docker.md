# Docker Setup for Fundamental App

This document explains the Docker setup for the Fundamental App and provides instructions on how to build and run the Docker image.

## Dockerfile Explanation

The `Dockerfile` in this project is used to create a Docker image for the Fundamental App. Below is a brief explanation of each step in the `Dockerfile`:

1. **Base Image**: The image is based on the official Node.js image.
    ```dockerfile
    FROM node:22.4.0
    ```

2. **Set Working Directory**: The working directory inside the container is set to `/app`.
    ```dockerfile
    WORKDIR /app
    ```

3. **Copy Package Files**: The `package.json` and `package-lock.json` files are copied to the working directory.
    ```dockerfile
    COPY package*.json ./
    ```

4. **Install Dependencies**: The dependencies are installed using `npm install`.
    ```dockerfile
    RUN npm install
    ```

5. **Copy Application Files**: All the application files are copied to the working directory.
    ```dockerfile
    COPY . .
    ```

6. **Expose Port**: Port `8081` is exposed to allow external access.
    ```dockerfile
    EXPOSE 8081
    ```

7. **Start Command**: The container is started using the `npm start` command.
    ```dockerfile
    CMD ["npm", "start"]
    ```

## Building the Docker Image

To build the Docker image, navigate to the directory containing the `Dockerfile` and run the following command:

```sh
docker build -t test:latest .
```

## Running the Docker image

```sh
docker run -it --network="host" -p 8081:8081 -p 5037:5037 test:latest
```