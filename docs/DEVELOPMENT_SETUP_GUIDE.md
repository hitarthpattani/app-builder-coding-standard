# Adobe App Builder - Development Setup Guide

## Overview

This guide provides step-by-step instructions to set up a comprehensive development environment for Adobe App Builder applications with modern tooling, code quality standards, testing, and CI/CD pipelines.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git repository initialized
- Adobe I/O CLI installed (`npm install -g @adobe/aio-cli`)
- Adobe Developer Console access

## Initial Project Setup

### 0. Setup Project Directory

Choose one of the following approaches based on your situation:

#### Option A: New Project with GitHub Repository

If you're starting fresh with a new GitHub repository:

```bash
# 1. Create empty GitHub repository first:
#    - Go to https://github.com/new
#    - Repository name: your-app-name
#    - Description: Adobe App Builder Application
#    - Keep it Public or Private as needed
#    - DO NOT initialize with README, .gitignore, or license
#    - Click "Create repository"

# 2. Clone the empty repository
git clone https://github.com/your-username/your-app-name.git
cd your-app-name

# 3. Initialize Adobe App Builder project in the current directory
aio app init --standalone-app

# Follow the interactive prompts:
# 1. Choose your Adobe Org
# 2. Select or create a project
# 3. Choose a workspace
# 4. Select template (recommended: @adobe/generator-aio-app)
# 5. Choose components:
#    - Actions: Yes (for backend logic)
#    - Web Assets: Yes (for React SPA)
#    - CI/CD: Optional (we'll set up our own)
# 6. When prompted for project name, use current directory (.)

# 4. Verify the project structure
ls -la
# You should see: actions/, web-src/, app.config.yaml, package.json, etc.

# 5. Test the initial setup
npm install
aio app run --local

# 6. Initial commit to GitHub
git add .
git commit -m "Initial Adobe App Builder project setup"
git push origin main
```

#### Option B: New Project (Local Only)

If you want to create a project locally first:

```bash
# 1. Create project directory
mkdir your-app-name
cd your-app-name

# 2. Initialize Adobe App Builder project in current directory
aio app init --standalone-app

# Follow the interactive prompts:
# 1. Choose your Adobe Org
# 2. Select or create a project
# 3. Choose a workspace
# 4. Select template (recommended: @adobe/generator-aio-app)
# 5. Choose components:
#    - Actions: Yes (for backend logic)
#    - Web Assets: Yes (for React SPA)
#    - CI/CD: Optional (we'll set up our own)
# 6. When prompted for project name, use current directory (.)

# 3. Verify the project structure
ls -la
# You should see: actions/, web-src/, app.config.yaml, package.json, etc.

# 4. Test the initial setup
npm install
aio app run --local

# 5. Initialize Git repository (optional)
git init
git add .
git commit -m "Initial Adobe App Builder project setup"
```

#### Option C: Clone Existing Project

If working with an existing Adobe App Builder project:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/your-app-name.git
cd your-app-name

# 2. Install dependencies
npm install

# 3. Test the existing setup
aio app run --local
```

## Pre-Setup: Verify Existing Dependencies

After creating or cloning your Adobe App Builder project, check what's already installed:

```bash
# Check if core packages are already installed
npm list eslint eslint-plugin-jest jest prettier typescript --depth=0

# Check for Babel packages
npm list babel-jest @babel/core --depth=1
```

**Typically pre-installed in Adobe App Builder projects:**

- `eslint` and `eslint-plugin-jest`
- `jest` (with `babel-jest` as transitive dependency)
- `@babel/core`, `@babel/preset-env`, etc.

**You'll likely need to install:**

- `husky` (Git hooks)
- `prettier` (Code formatting)
- `typescript` and `@types/*` packages (if adding TypeScript)

## Step-by-Step Setup

### 1. ESLint Configuration

> **Note**: ESLint and eslint-plugin-jest should already be installed in Adobe App Builder projects. If not, install with:
> `npm install --save-dev eslint eslint-plugin-jest`

#### 1.1 Create ESLint Configuration

Create `.eslintrc.json` in your project root:

```json
{
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "jest": true
  },
  "extends": ["eslint:recommended"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": "warn",
    "no-debugger": "error",
    "no-duplicate-case": "error",
    "no-empty": "error",
    "no-extra-semi": "error",
    "no-func-assign": "error",
    "no-irregular-whitespace": "error",
    "no-unreachable": "error",
    "use-isnan": "error",
    "valid-typeof": "error",
    "curly": "error",
    "dot-notation": "error",
    "eqeqeq": "error",
    "no-empty-function": "error",
    "no-multi-spaces": "error",
    "no-mixed-spaces-and-tabs": "error",
    "no-trailing-spaces": "error",
    "default-case": "error",
    "no-fallthrough": "error",
    "no-floating-decimal": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-throw-literal": "error",
    "no-loop-func": "error",
    "no-unmodified-loop-condition": "error",
    "prefer-const": "error",
    "no-var": "error",
    "comma-dangle": ["error", "only-multiline"],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "brace-style": ["error", "1tbs"],
    "keyword-spacing": "error",
    "space-before-blocks": "error",
    "space-in-parens": ["error", "never"],
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "spaced-comment": "error"
  },
  "overrides": [
    {
      "files": ["**/web-src/**/*.js", "**/web-src/**/*.jsx"],
      "rules": {
        "no-unused-vars": [
          "error",
          {
            "varsIgnorePattern": "^(React|PropTypes|[A-Z].*)$",
            "argsIgnorePattern": "^_"
          }
        ],
        "no-console": "off"
      }
    }
  ]
}
```

#### 1.2 Add ESLint Scripts to package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint --no-error-on-unmatched-pattern test src actions scripts lib web-src e2e jest.config.js jest.setup.js",
    "lint:check": "eslint --no-error-on-unmatched-pattern --max-warnings 0 test src actions scripts lib web-src e2e jest.config.js jest.setup.js",
    "lint:fix": "npm run lint -- --fix"
  }
}
```

### 2. Prettier Configuration

#### 2.1 Install Prettier

```bash
npm install --save-dev prettier
```

#### 2.2 Create Prettier Configuration

Create `.prettierrc` in your project root:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "proseWrap": "preserve"
}
```

#### 2.3 Create Prettier Ignore File

Create `.prettierignore`:

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
coverage/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# DynamoDB Local files
.dynamodb/

# Package lock files
package-lock.json
yarn.lock

# Generated files
*.d.ts
*.min.js
*.min.css
```

#### 2.4 Add Prettier Scripts

Add to `package.json` scripts:

```json
{
  "scripts": {
    "format": "prettier --write --no-error-on-unmatched-pattern test src actions scripts lib web-src e2e jest.config.js jest.setup.js .eslintrc.json *.md docs/*.md",
    "format:check": "prettier --check --no-error-on-unmatched-pattern test src actions scripts lib web-src e2e jest.config.js jest.setup.js .eslintrc.json *.md docs/*.md"
  }
}
```

### 3. Jest Testing Configuration

> **Note**: Jest should already be installed in Adobe App Builder projects. `babel-jest` comes as a transitive dependency of Jest.
> If Jest is not installed, add it with: `npm install --save-dev jest`

#### 3.1 Create Jest Configuration

Create `jest.config.js`:

```javascript
module.exports = {
  // Test environment for Node.js (Adobe App Builder actions)
  testEnvironment: 'node',

  // Setup files to run after Jest environment is set up
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Directories to search for tests and modules (only existing directories)
  roots: ['<rootDir>/test', '<rootDir>/actions'],

  // Test file patterns (using testMatch, not testRegex) - excludes e2e
  testMatch: [
    '**/test/**/*.+(js|jsx)',
    '**/*.(test|spec).+(js|jsx)',
    '**/__tests__/**/*.+(js|jsx)',
  ],

  // Transform configuration for different file types
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // Files to include in coverage collection (includes future directories)
  collectCoverageFrom: [
    'actions/**/*.{js,jsx}',
    'src/**/*.{js,jsx}',
    'scripts/**/*.{js,jsx}',
    'lib/**/*.{js,jsx}',
    '!**/*.config.js',
    '!**/*.setup.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/e2e/**',
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Coverage report formats
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Coverage thresholds (adjusted for Adobe App Builder project)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Specific thresholds for actions
    'actions/**/*.js': {
      branches: 85,
      functions: 90,
      lines: 85,
      statements: 85,
    },
  },

  // Module name mapping for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@actions/(.*)$': '<rootDir>/actions/$1',
    '^@scripts/(.*)$': '<rootDir>/scripts/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@utils/(.*)$': '<rootDir>/actions/utils',
  },

  // Test timeout (matches your jest.setup.js)
  testTimeout: 10000,

  // Ignore patterns for test discovery
  testPathIgnorePatterns: ['/node_modules/', '/coverage/', '/dist/', '/build/', '/web-src/'],

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'json'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output for better debugging
  verbose: true,

  // Detect open handles to prevent hanging tests
  detectOpenHandles: true,

  // Adobe App Builder specific configurations
  globals: {
    // Environment variables that might be used in actions
    __OW_ACTION_NAME: 'test-action',
    __OW_NAMESPACE: 'test-namespace',
  },

  // Setup for Adobe I/O Runtime environment simulation
  testEnvironmentOptions: {
    // Node.js environment options
  },
};
```

#### 3.2 Add Test Scripts

Add to `package.json` scripts:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "e2e": "jest --collectCoverage=false --roots=e2e --testMatch=\"**/e2e/**/*.+(js|jsx)\""
  }
}
```

### 4. Security Audit Scripts

Add to `package.json` scripts:

```json
{
  "scripts": {
    "security:audit": "npm audit --audit-level moderate",
    "security:fix": "npm audit fix"
  }
}
```

### 5. Git Hooks with Husky

#### 5.1 Install Husky

```bash
npm install --save-dev husky
```

#### 5.2 Initialize Husky

```bash
npx husky init
```

#### 5.3 Create Pre-commit Hook

```bash
npx husky add .husky/pre-commit "npm run lint:check && npm run format:check && npm run test:ci"
```

#### 5.4 Create Pre-push Hook

```bash
npx husky add .husky/pre-push "npm run lint:check && npm run test:ci"
```

#### 5.5 Update package.json prepare script

```json
{
  "scripts": {
    "prepare": "[ \"$CI\" = \"true\" ] || husky"
  }
}
```

### 6. Development Scripts

Add comprehensive development workflow scripts to `package.json`:

```json
{
  "scripts": {
    "dev:clean": "rm -rf node_modules package-lock.json && npm install",
    "dev:reset": "npm run dev:clean && npm run prepare",
    "dev:fresh": "npm run dev:reset && npm run lint:fix && npm run format",
    "dev:validate": "npm run lint:check && npm run format:check && npm run test:ci && npm run security:audit",
    "dev:setup": "npm install && npm run prepare"
  }
}
```

### 7. TypeScript Support (React Components)

#### 7.1 Install TypeScript Dependencies

```bash
npm install --save-dev typescript @types/react @types/react-dom @types/node @types/react-router-dom
```

#### 7.2 Create TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react",
    "exactOptionalPropertyTypes": false,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitOverride": true
  },
  "include": ["web-src/src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "build",
    "coverage",
    "actions",
    "test",
    "e2e",
    "web-src/src/exc-runtime.js"
  ]
}
```

#### 7.3 Add TypeScript Scripts

Add to `package.json` scripts:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch"
  }
}
```

#### 7.4 Update Husky Hooks for TypeScript

Update `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint:check && npm run format:check && npm run type-check && npm run test:ci
```

Update `.husky/pre-push`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint:check && npm run type-check && npm run test:ci
```

### 8. VS Code Workspace Configuration

#### 8.1 Create Workspace File

Create `workspace.code-workspace.example`:

```json
{
  "folders": [
    {
      "path": "."
    }
  ],
  "settings": {
    "terminal.integrated.defaultProfile.osx": "zsh",
    "terminal.integrated.profiles.osx": {
      "zsh": {
        "path": "/bin/zsh",
        "args": ["-l", "-i"]
      }
    }
  },
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      {
        "type": "shell",
        "label": "lint:check",
        "command": "npm run lint:check",
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": ["$eslint-stylish"]
      },
      {
        "type": "shell",
        "label": "format:check",
        "command": "npm run format:check",
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": []
      },
      {
        "type": "shell",
        "label": "type-check:watch",
        "command": "npm run type-check:watch",
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": ["$tsc-watch"],
        "isBackground": true
      },
      {
        "type": "shell",
        "label": "dev:all",
        "command": "echo",
        "args": ["Running all development checks"],
        "group": {
          "kind": "build",
          "isDefault": true
        },
        "dependsOrder": "sequence",
        "dependsOn": ["lint:fix", "format", "type-check", "test:ci"],
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": []
      },
      {
        "type": "shell",
        "label": "aio:app:run",
        "command": "aio app run",
        "group": {
          "kind": "build",
          "isDefault": false
        },
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": []
      },
      {
        "type": "shell",
        "label": "aio:where",
        "command": "aio where",
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": []
      },
      {
        "type": "shell",
        "label": "aio:config:clear",
        "command": "aio config clear",
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": []
      },
      {
        "type": "shell",
        "label": "aio:setup:environment",
        "command": "echo",
        "args": ["Setting up Adobe I/O environment"],
        "group": "build",
        "dependsOrder": "sequence",
        "dependsOn": [
          "aio:console:org:select",
          "aio:console:project:select",
          "aio:console:workspace:select"
        ],
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": []
      },
      {
        "type": "shell",
        "label": "aio:console:org:select",
        "command": "aio console org select",
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": []
      },
      {
        "type": "shell",
        "label": "aio:console:project:select",
        "command": "aio console project select",
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": []
      },
      {
        "type": "shell",
        "label": "aio:console:workspace:select",
        "command": "aio console workspace select",
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": []
      },
      {
        "type": "shell",
        "label": "aio:login",
        "command": "aio login",
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": []
      },
      {
        "type": "shell",
        "label": "aio:logout",
        "command": "aio logout",
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        },
        "problemMatcher": []
      }
    ]
  },
  "extensions": {
    "recommendations": [
      "esbenp.prettier-vscode",
      "dbaeumer.vscode-eslint",
      "eamodio.gitlens",
      "ms-vscode.vscode-typescript-next",
      "bradlc.vscode-tailwindcss",
      "ms-vscode.vscode-json"
    ]
  }
}
```

### 9. CI/CD Pipeline Setup

#### 9.1 Create GitHub Actions Directory

```bash
mkdir -p .github/workflows
```

#### 9.2 Pull Request Pipeline

Create `.github/workflows/ci-cd-pr-pipeline.yml`:

```yaml
# CI/CD PR Pipeline Configuration
# This file serves as a template for continuous integration and deployment pipeline
# Configure according to your CI/CD platform (GitHub Actions, GitLab CI, etc.)

name: CI/CD PR Pipeline

on: [pull_request]

jobs:
  code-quality:
    name: Code Quality
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        node-version: ['20']
        os: [ubuntu-latest]
    timeout-minutes: 10

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install Dependencies
        run: npm ci --prefer-offline --no-audit

      - name: Lint Check
        run: npm run lint:check

      - name: Type Check (TypeScript)
        run: npm run type-check

      - name: Format Check
        run: npm run format:check

      - name: Security Audit
        run: npm run security:audit

      - name: Tests (Unit Tests)
        uses: adobe/aio-apps-action@3.3.0
        with:
          os: ${{ matrix.os }}
          command: test

      - name: Security Audit (Advisory)
        run: npm run security:audit || true
        continue-on-error: true

  build:
    name: Build
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        node-version: ['20']
        os: [ubuntu-latest]
    timeout-minutes: 10
    needs: [code-quality]

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install Dependencies
        run: npm ci --prefer-offline --no-audit

      - name: Setup AIO CLI
        uses: adobe/aio-cli-setup-action@1.3.0
        with:
          os: ${{ matrix.os }}
          version: 10.x.x

      - name: Validate Authorization (AIO CLI)
        uses: adobe/aio-apps-action@3.3.0
        with:
          os: ${{ matrix.os }}
          command: oauth_sts
          CLIENTID: ${{ secrets.CLIENTID_STAGE }}
          CLIENTSECRET: ${{ secrets.CLIENTSECRET_STAGE }}
          TECHNICALACCOUNTID: ${{ secrets.TECHNICALACCID_STAGE }}
          TECHNICALACCOUNTEMAIL: ${{ secrets.TECHNICALACCEMAIL_STAGE }}
          IMSORGID: ${{ secrets.IMSORGID_STAGE }}
          SCOPES: ${{ secrets.SCOPES_STAGE }}

      - name: Build Application (AIO CLI)
        env:
          AIO_RUNTIME_NAMESPACE: ${{ secrets.AIO_RUNTIME_NAMESPACE_STAGE }}
        uses: adobe/aio-apps-action@3.3.0
        with:
          os: ${{ matrix.os }}
          command: build
```

#### 9.3 Stage Deployment Pipeline

Create `.github/workflows/ci-cd-stage-deploy-pipeline.yml`:

```yaml
# CI/CD Stage Deployment Pipeline Configuration
# This pipeline runs comprehensive quality checks and deploys to staging environment
# Triggers on pushes to stage/staging branches with full CI/CD validation

name: CI/CD Stage Deploy Pipeline

on:
  push:
    branches:
      - stage
      - staging

jobs:
  code-quality:
    name: Code Quality
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        node-version: ['20']
        os: [ubuntu-latest]
    timeout-minutes: 10

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install Dependencies
        run: npm ci --prefer-offline --no-audit

      - name: Lint Code (ESLint)
        run: npm run lint:check

      - name: Format Code (Prettier)
        run: npm run format:check

      - name: Type Check (TypeScript)
        run: npm run type-check

      - name: Tests (Unit Tests)
        uses: adobe/aio-apps-action@3.3.0
        with:
          os: ${{ matrix.os }}
          command: test

      - name: Security Audit (Advisory)
        run: npm run security:audit || true
        continue-on-error: true

  deploy:
    name: Deploy to Stage
    runs-on: ${{ matrix.os }}
    strategy:
      max-parallel: 1
      matrix:
        node-version: ['20']
        os: [ubuntu-latest]
    timeout-minutes: 20
    needs: [code-quality]

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install Dependencies
        run: npm ci --prefer-offline --no-audit

      - name: Setup AIO CLI
        uses: adobe/aio-cli-setup-action@1.3.0
        with:
          os: ${{ matrix.os }}
          version: 10.x.x

      - name: Validate Authorization (AIO CLI)
        uses: adobe/aio-apps-action@3.3.0
        with:
          os: ${{ matrix.os }}
          command: oauth_sts
          CLIENTID: ${{ secrets.CLIENTID_STAGE }}
          CLIENTSECRET: ${{ secrets.CLIENTSECRET_STAGE }}
          TECHNICALACCOUNTID: ${{ secrets.TECHNICALACCID_STAGE }}
          TECHNICALACCOUNTEMAIL: ${{ secrets.TECHNICALACCEMAIL_STAGE }}
          IMSORGID: ${{ secrets.IMSORGID_STAGE }}
          SCOPES: ${{ secrets.SCOPES_STAGE }}

      - name: Build Application (AIO CLI)
        env:
          AIO_RUNTIME_NAMESPACE: ${{ secrets.AIO_RUNTIME_NAMESPACE_STAGE }}
        uses: adobe/aio-apps-action@3.3.0
        with:
          os: ${{ matrix.os }}
          command: build

      - name: Deploy Application (AIO CLI)
        env:
          AIO_RUNTIME_NAMESPACE: ${{ secrets.AIO_RUNTIME_NAMESPACE_STAGE }}
          AIO_RUNTIME_AUTH: ${{ secrets.AIO_RUNTIME_AUTH_STAGE }}
          AIO_PROJECT_ID: ${{ secrets.AIO_PROJECT_ID_STAGE }}
          AIO_PROJECT_NAME: ${{ secrets.AIO_PROJECT_NAME_STAGE }}
          AIO_PROJECT_ORG_ID: ${{ secrets.AIO_PROJECT_ORG_ID_STAGE }}
          AIO_PROJECT_WORKSPACE_ID: ${{ secrets.AIO_PROJECT_WORKSPACE_ID_STAGE }}
          AIO_PROJECT_WORKSPACE_NAME: ${{ secrets.AIO_PROJECT_WORKSPACE_NAME_STAGE }}
          AIO_PROJECT_WORKSPACE_DETAILS_SERVICES: ${{ secrets.AIO_PROJECT_WORKSPACE_DETAILS_SERVICES_STAGE }}
        uses: adobe/aio-apps-action@3.3.0
        with:
          os: ${{ matrix.os }}
          command: deploy
          noPublish: true
```

#### 9.4 Production Deployment Pipeline

Create `.github/workflows/ci-cd-prod-deploy-pipeline.yml`:

```yaml
# CI/CD Production Deployment Pipeline Configuration
# This pipeline runs comprehensive quality checks and deploys to production environment
# Triggers on pushes to main/master/production branches and GitHub releases

name: CI/CD Production Deploy Pipeline

on:
  push:
    branches:
      - main
      - master
      - production
  release:
    types: [released]

jobs:
  code-quality:
    name: Code Quality
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        node-version: ['20']
        os: [ubuntu-latest]
    timeout-minutes: 10

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install Dependencies
        run: npm ci --prefer-offline --no-audit

      - name: Lint Code (ESLint)
        run: npm run lint:check

      - name: Format Code (Prettier)
        run: npm run format:check

      - name: Type Check (TypeScript)
        run: npm run type-check

      - name: Tests (Unit Tests)
        uses: adobe/aio-apps-action@3.3.0
        with:
          os: ${{ matrix.os }}
          command: test

      - name: Security Audit (Advisory)
        run: npm run security:audit || true
        continue-on-error: true

  deploy:
    name: Deploy to Prod
    runs-on: ${{ matrix.os }}
    strategy:
      max-parallel: 1
      matrix:
        node-version: ['20']
        os: [ubuntu-latest]
    timeout-minutes: 20
    needs: [code-quality]

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install Dependencies
        run: npm ci --prefer-offline --no-audit

      - name: Setup AIO CLI
        uses: adobe/aio-cli-setup-action@1.3.0
        with:
          os: ${{ matrix.os }}
          version: 10.x.x

      - name: Validate Authorization (AIO CLI)
        uses: adobe/aio-apps-action@3.3.0
        with:
          os: ${{ matrix.os }}
          command: oauth_sts
          CLIENTID: ${{ secrets.CLIENTID_PROD }}
          CLIENTSECRET: ${{ secrets.CLIENTSECRET_PROD }}
          TECHNICALACCOUNTID: ${{ secrets.TECHNICALACCID_PROD }}
          TECHNICALACCOUNTEMAIL: ${{ secrets.TECHNICALACCEMAIL_PROD }}
          IMSORGID: ${{ secrets.IMSORGID_PROD }}
          SCOPES: ${{ secrets.SCOPES_PROD }}

      - name: Build Application (AIO CLI)
        env:
          AIO_RUNTIME_NAMESPACE: ${{ secrets.AIO_RUNTIME_NAMESPACE_PROD }}
        uses: adobe/aio-apps-action@3.3.0
        with:
          os: ${{ matrix.os }}
          command: build

      - name: Deploy Application (AIO CLI)
        env:
          AIO_RUNTIME_NAMESPACE: ${{ secrets.AIO_RUNTIME_NAMESPACE_PROD }}
          AIO_RUNTIME_AUTH: ${{ secrets.AIO_RUNTIME_AUTH_PROD }}
          AIO_PROJECT_ID: ${{ secrets.AIO_PROJECT_ID_PROD }}
          AIO_PROJECT_NAME: ${{ secrets.AIO_PROJECT_NAME_PROD }}
          AIO_PROJECT_ORG_ID: ${{ secrets.AIO_PROJECT_ORG_ID_PROD }}
          AIO_PROJECT_WORKSPACE_ID: ${{ secrets.AIO_PROJECT_WORKSPACE_ID_PROD }}
          AIO_PROJECT_WORKSPACE_NAME: ${{ secrets.AIO_PROJECT_WORKSPACE_NAME_PROD }}
          AIO_PROJECT_WORKSPACE_DETAILS_SERVICES: ${{ secrets.AIO_PROJECT_WORKSPACE_DETAILS_SERVICES_PROD }}
        uses: adobe/aio-apps-action@3.3.0
        with:
          os: ${{ matrix.os }}
          command: deploy
```

#### 9.5 GitHub Pull Request Template

Create `.github/pull_request_template.md`:

```markdown
## 📋 Pull Request Description

### What does this PR do?

<!-- Provide a clear and concise description of the changes -->

### Type of Change

<!-- Check the relevant option(s) -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🎨 Code style/formatting changes
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] ⚡ Performance improvements
- [ ] 🧪 Test additions or updates
- [ ] 🔧 Build/CI configuration changes

## 🧪 Testing

### How has this been tested?

<!-- Describe the tests that you ran to verify your changes -->

- [ ] Unit tests pass (`npm run test`)
- [ ] E2E tests pass (`npm run e2e`)
- [ ] Manual testing performed
- [ ] Adobe App Builder deployment tested

### Test Coverage

<!-- If applicable, describe test coverage -->

- [ ] New tests added for new functionality
- [ ] Existing tests updated as needed
- [ ] Coverage threshold maintained (>=80%)

## 🔍 Code Quality Checklist

### Pre-submission Checks

<!-- Confirm all quality checks pass -->

- [ ] Code follows project style guidelines (`npm run lint:check`)
- [ ] Code is properly formatted (`npm run format:check`)
- [ ] Security audit passes (`npm run security:audit`)
- [ ] All validation checks pass (`npm run dev:validate`)

### Code Review Areas

<!-- Help reviewers focus their attention -->

- [ ] Logic changes
- [ ] Performance implications
- [ ] Security considerations
- [ ] Adobe App Builder specific changes
- [ ] Breaking changes
- [ ] Documentation updates needed

## 🎯 Adobe App Builder Specifics

### Actions Modified

<!-- List any Adobe I/O Runtime actions that were changed -->

- [ ] No action changes
- [ ] Modified existing actions:
- [ ] Added new actions:
- [ ] Removed actions:

### Configuration Changes

<!-- Check if any Adobe configuration was modified -->

- [ ] No configuration changes
- [ ] `app.config.yaml` updated
- [ ] Environment variables changed
- [ ] Secrets/authentication updated
- [ ] Resource allocation modified

### Deployment Considerations

<!-- Important for staging/production deployments -->

- [ ] No deployment impact
- [ ] Requires environment variable updates
- [ ] Requires Adobe project configuration changes
- [ ] Backward compatibility maintained
- [ ] Migration/rollback plan documented

## 📸 Screenshots/Evidence

<!-- If applicable, add screenshots or evidence of changes -->

## 🔗 Related Issues

<!-- Link to any related GitHub issues -->

Closes #
Related to #

## 💥 Breaking Changes

<!-- If this PR introduces breaking changes, describe them here -->

- [ ] No breaking changes
- [ ] Breaking changes documented below:

<!-- Describe breaking changes and migration path -->

## 📝 Additional Context

<!-- Add any other context, considerations, or notes for reviewers -->

---

## 🎉 Ready for Review!

<!-- Once all boxes are checked and PR is ready -->

- [ ] All checks completed
- [ ] Ready for code review
- [ ] Author available for questions/feedback
```

### 10. Documentation Structure

#### 10.1 Create Documentation Directory

```bash
mkdir docs
```

#### 10.2 Move Documentation Files

```bash
# Move any existing .md files except README.md to docs/
mv *.md docs/ 2>/dev/null || true
# Keep README.md in root
mv docs/README.md . 2>/dev/null || true
```

## Quick Setup Commands

### Complete Setup in One Go

#### For New GitHub Projects:

```bash
# 0. Setup project with GitHub repository
git clone https://github.com/your-username/your-app-name.git
cd your-app-name
aio app init --standalone-app
# (Follow interactive prompts, use current directory when asked for project name)

# 1. Install dependencies (skip packages already installed in your Adobe App Builder project)
npm install --save-dev husky prettier typescript @types/react @types/react-dom @types/node @types/react-router-dom

# 2. Initialize Husky
npx husky init

# 3. Create directory structure
mkdir -p docs .github/workflows .husky

# 4. Copy all configuration files from this guide

# 5. Set up git hooks
npx husky add .husky/pre-commit "npm run lint:check && npm run format:check && npm run type-check && npm run test:ci"
npx husky add .husky/pre-push "npm run lint:check && npm run type-check && npm run test:ci"

# 6. Run initial setup
npm run dev:setup
npm run format
npm run lint:fix

# 7. Commit to GitHub
git add .
git commit -m "Add comprehensive development tooling and CI/CD setup"
git push origin main
```

#### For Local Projects:

```bash
# 0. Create project directory and initialize Adobe App Builder
mkdir your-app-name
cd your-app-name
aio app init --standalone-app
# (Follow interactive prompts, use current directory when asked for project name)

# 1-6. Follow same steps as above

# 7. Initialize Git (optional)
git init
git add .
git commit -m "Initial setup with comprehensive development tooling"
```

### Validation Commands

```bash
# Validate setup
npm run dev:validate

# Check individual components
npm run lint:check
npm run format:check
npm run type-check
npm run test:ci
npm run security:audit
```

## Usage Instructions

### Daily Development Workflow

1. **Start development**: `npm run type-check:watch` (in background)
2. **Make changes**: Edit files with real-time type checking
3. **Before commit**: Hooks automatically run validation
4. **Manual validation**: `npm run dev:validate`
5. **Fresh start**: `npm run dev:fresh` (full reset + format)

### VS Code Integration

1. Copy `workspace.code-workspace.example` to `your-project.code-workspace`
2. Open the workspace file in VS Code
3. Install recommended extensions when prompted
4. Use Command Palette → "Tasks: Run Task" to access all npm scripts

### CI/CD Integration

1. Set up repository secrets for Adobe I/O Runtime
2. Push to stage/production branches triggers deployment
3. All PRs are automatically validated
4. Quality gates must pass before deployment

## Troubleshooting

### Common Issues

1. **Husky not working in CI**: The prepare script handles CI detection automatically
2. **TypeScript errors**: Run `npm run type-check` to see detailed errors
3. **ESLint/Prettier conflicts**: Configuration is pre-aligned to avoid conflicts
4. **Test failures**: Check Jest configuration matches your directory structure

### Reset Commands

```bash
# Complete reset
npm run dev:fresh

# Clean slate
npm run dev:reset

# Just dependencies
npm run dev:clean
```

This guide provides a complete, copy-paste setup for a professional Adobe App Builder development environment with modern tooling and best practices.
