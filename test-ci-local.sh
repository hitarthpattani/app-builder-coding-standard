#!/bin/bash

# Test CI/CD Pipeline Locally
# This script runs all the same checks that the GitHub Actions CI pipeline runs

set -e  # Exit on any error

echo "🧪 Testing CI/CD Pipeline Locally"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

echo -e "\n${YELLOW}Step 1: Installing dependencies...${NC}"
npm ci
print_status $? "Dependencies installed"

echo -e "\n${YELLOW}Step 2: Running ESLint...${NC}"
npm run lint:check
print_status $? "ESLint passed"

echo -e "\n${YELLOW}Step 3: Code formatting check...${NC}"
npm run format:check
print_status $? "Code formatting passed"

echo -e "\n${YELLOW}Step 4: Running tests with coverage...${NC}"
npm run test:ci
print_status $? "Tests passed"

echo -e "\n${GREEN}🎉 All CI checks passed locally!${NC}"
echo -e "${YELLOW}You can now safely push to trigger the GitHub Actions pipeline.${NC}"