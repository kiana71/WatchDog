# TypeScript to JavaScript Conversion

This project was originally written in TypeScript and has been converted to JavaScript for easier maintenance.

## Conversion Process

1. TypeScript specific syntax has been removed:
   - Type annotations
   - Type interfaces and type declarations
   - Generic type parameters
   - Type assertions

2. File extensions have been updated:
   - .ts → .js
   - .tsx → .jsx

3. Configuration files have been updated:
   - Removed tsconfig files
   - Added jsconfig.json for JavaScript editor support
   - Updated build configuration

## Remaining Linter Issues

There may be some syntax highlighting or linting issues with JSX in certain editors. This is because JSX requires special handling by JavaScript parsers. These issues don't affect the actual functionality of the code and can be fixed by:

1. Adding proper Babel configuration
2. Using the right ESLint plugins
3. Configuring your editor to recognize JSX syntax in .jsx files

## Building the Project

Use the following commands to work with the project:

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
``` 