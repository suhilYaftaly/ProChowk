# Backend README

## Overview

This backend is built using Node.js with Apollo Server for GraphQL. We use Prisma to connect to MongoDB and handle database queries. The entire codebase is written in TypeScript.

## Prerequisites

- Install the latest version of [Node.js](https://nodejs.org/).

## Setup

1. **Clone the repository**: if you havn't done so already.

   ```sh
   git clone <https://github.com/suhilYaftaly/ProChowk.gitl>
   cd backend
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Generate Prisma types**:

   ```sh
   npm run generate-prisma
   ```

   This command needs to be run anytime you make changes to the [Prisma schema](./src/prisma/schema.prisma).

4. **Environment Variables**:
   - Obtain the `.env` file from a development team member.
   - Place the `.env` file in the root folder of the project.

`.env` file is a sensitive file so make sure to keep it secret.

5. **Start the development server**:
   ```sh
   npm run dev
   ```
   Once the server is running, you can access the API at http://localhost:9001/graphql.
