#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Starting API tests..."

# Create test users
echo -e "\n${GREEN}1. Creating test users${NC}"

# Create first user
echo -e "\nCreating first user..."

for i in {1..15}; do
    curl -X POST ${BASE_URL}/users \
    -H "Content-Type: application/json" \
    -d '{
        "username": "user'$i'",
        "email": "user'$i'@example.com",
        "password": "password'$i++'"
    }'
done

# Create second user
echo -e "\n\nCreating second user..."
curl -X POST ${BASE_URL}/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_smith",
    "email": "jane@example.com",
    "password": "password456"
  }'

# Get all users
echo -e "\n\n${GREEN}2. Getting all users${NC}"
curl -X GET ${BASE_URL}/users

# Get user by ID (assuming ID 1 exists)
echo -e "\n\n${GREEN}3. Getting user by ID 1${NC}"
curl -X GET ${BASE_URL}/users/1

# Update user
echo -e "\n\n${GREEN}4. Updating user 1${NC}"
curl -X PUT ${BASE_URL}/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe_updated",
    "email": "john_updated@example.com"
  }'

# Get updated user
echo -e "\n\n${GREEN}5. Getting updated user${NC}"
curl -X GET ${BASE_URL}/users/1

# Delete user
echo -e "\n\n${GREEN}6. Deleting user 2${NC}"
curl -X DELETE ${BASE_URL}/users/2

# Verify deletion
echo -e "\n\n${GREEN}7. Verifying deletion - Getting all users${NC}"
curl -X GET ${BASE_URL}/users

echo -e "\n\nAPI tests completed!"