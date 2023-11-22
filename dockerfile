# Use a base Node.js image
FROM node:20-alpine

# Install PNPM globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (or package-lock.json for npm v7) if using PNPM
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using PNPM
RUN pnpm install

# Copy the rest of the application files
COPY . .

# Set the command to run your Nest.js app
CMD [ "pnpm", "start" ]
