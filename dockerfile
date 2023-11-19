# Use a base Node.js image
FROM node:20-alpine

# Copy package.json 
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN yarn install 

# Copy the rest of the application files
COPY . .

# Set the command to run your Nest.js app
CMD [ "pnpm run", "start:dev" ]