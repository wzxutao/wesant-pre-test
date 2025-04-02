# Default target
all: install build start

install: 
	npm install

# Build the Next.js project for production
build:
	npm run build

# Run the Next.js production server
start:
	PORT=3000 npm run start

# Optional: Clean target to remove node_modules and reinstall dependencies
clean:
	rm -rf node_modules
	npm install
