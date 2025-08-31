# Notes Backend

This is a backend service for managing notes, built with Node.js, Express, and TypeScript.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <https://github.com/veer-kalpit/notes-backend.git>
   cd notes-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**

   - Set up any other environment variables as needed (see `src/config/db.ts` for database configuration).

4. **Build the project**

   ```bash
   npm run build
   ```

   This will compile the TypeScript source files into JavaScript in the `dist/` directory.

5. **Run the project**

   - For production:
     ```bash
     npm start
     ```
   - For development (with auto-reload):
     ```bash
     npm run dev
     ```

## Project Structure

- `src/` - Source code
  - `controllers/` - Route controllers
  - `middlewares/` - Custom middleware
  - `models/` - Mongoose models
  - `routes/` - Express routes
  - `config/` - Configuration files
- `package.json` - Project metadata and scripts
- `tsconfig.json` - TypeScript configuration

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled app
- `npm run dev` - Run the app in development mode with auto-reload

## License

MIT

---

**Made by:** Kalpit Thakur  
**Contact:** veerkalpit@gmail.com  
**LinkedIn:** [https://www.linkedin.com/in/kalpit-thakur/](https://www.linkedin.com/in/kalpit-thakur/)
