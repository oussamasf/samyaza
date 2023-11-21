# flix-flex - NestJS API for Managing Movies and Series

flix-flex is a NestJS-based API project designed to manage movies and series akin to TMDB (The Movie Database). It allows users to handle favorite movies and TV series, conduct searches within movies, and access trailers.

## Features

- **Favorite Management:** Users can manage their favorite movies and series.
- **Search Capability:** Search functionality within the collection of movies and series.
- **Trailer Access:** Ability to access trailers for movies and series.

## Installation Requirements

To run the flix-flex project locally, ensure you have the following prerequisites:

- Node.js version 20
- NestJS framework
- Docker

## Setup Instructions

Follow these steps to set up and run flix-flex locally:

1. **Clone Repository:**

   ```bash
   git clone https://github.com/oussamasf/flix-flex
   ```
2. **Duplicate `.env.example` and name it `.env`
3. **Start Docker Containers:**
Run Docker Compose:
   ```bash
    docker-compose up -d
4. **Add Super Admin to MongoDB**:
Manually add a super admin to the MongoDB instance.
5. **Seed Database and Create Index**:

## Usage
The usage of the flix-flex API is documented in detail through Postman and Swagger.

## Configuration
For configuration settings, refer to the provided `.env.example` file.
