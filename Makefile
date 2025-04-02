# Makefile

# Default target
all: install build start

# Install dependencies
install:
    npm install

# Build the Next.js project for production
build:
    npm run build

# Run the Next.js production server
start:
	PORT=3000 npm run start

# Optional: Add a clean target to remove node_modules
clean:
    rm -rf node_modules
    npm install
