# Flix-flex - NestJS API for Managing Movies and Series
## flix-flex is a NestJS-based API project designed to manage movies and series similar to TMDB (The Movie Database). It allows users to handle favorite movies and TV series, conduct searches within movies, and access trailers.

## Features
- Favorite Management: Users can manage their favorite movies and series.
- Search Capability: Functionality to search within the collection of movies and series.
- Trailer Access: Ability to access trailers for movies and series.
  
## Installation Requirements
To run the flix-flex project locally, ensure you have the following prerequisites:

- Node.js version 20
- NestJS framework
- Docker
  
## Setup Instructions
Follow these steps to set up and run flix-flex locally:

1- Clone Repository:

```bash
git clone https://github.com/oussamasf/flix-flex.git
cd flix-flex
```
2- Configure Environment Variables:

Duplicate the .env.example file twice and name them .env.development and .env.

3- Start Docker Containers:

Run Docker Compose:

```bash
docker compose -f "docker-compose.yaml" up -d --build
```
Then start the application using the following commands:

```bash
pnpm i
pnpm run start:dev
```
4- Add Super Admin to MongoDB:

Manually add a super admin to the MongoDB instance. Inject the following data under the admins collection:

```json
{
  "username": "ousf",
  "password": "$2b$10$KVAMN18gLNr/4sk01LcC/O..0ycOYGaIqw.diV0kzjfRnrYA.9u9O",
  "email": "ousf@gmail.com",
  "roles": [
    "admin",
    "super"
  ]
}
```
Now you can log in at **/api/v1/backoffice/account/login** using the following credentials:

```json
{
  "email": "ousf@gmail.com",
  "password": "gg@&123456"
}
```
5- Seed Database and Create Index:

Using the backoffice, send a request to **api/backoffice/{{movie/series/genre}}/seed**.

Then map movie data if you intend to use advanced search via **api/backoffice/movie/map**.

Feel free to explore all endpoints, which are documented on Swagger or Postman.

## Usage
The usage of the flix-flex API is thoroughly documented in Postman and Swagger.

Swagger: http://host:port/api

[Postman Workspace](https://www.postman.com/red-flare-724255/workspace/flixflex/overview)

## Configuration
Refer to the provided .env.example file for configuration settings.
