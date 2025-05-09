#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to process
const dirsToProcess = ['src', 'client'];

// Function to recursively process directories
function processDirectory(dirPath) {
  console.log(`Processing directory: ${dirPath}`);
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      processDirectory(itemPath);
    } else if (stats.isFile()) {
      processFile(itemPath);
    }
  }
}

// Function to process each file
function processFile(filePath) {
  const ext = path.extname(filePath);
  
  // Only process TypeScript files
  if (ext === '.ts' || ext === '.tsx') {
    console.log(`Converting: ${filePath}`);
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove type annotations
    content = removeTypeAnnotations(content);
    
    // Determine new file extension
    const newExt = ext === '.ts' ? '.js' : '.jsx';
    const newFilePath = filePath.replace(ext, newExt);
    
    // Write new JavaScript file
    fs.writeFileSync(newFilePath, content);
    
    // Delete original TypeScript file
    fs.unlinkSync(filePath);
    
    console.log(`Created: ${newFilePath}`);
  }
}

// Simple function to remove TypeScript type annotations
function removeTypeAnnotations(content) {
  // Remove import type statements
  content = content.replace(/import\s+type\s+.*?from\s+['"].*?['"]/g, '');
  
  // Remove type declarations
  content = content.replace(/type\s+\w+\s*=\s*{[^}]*}/g, '');
  content = content.replace(/interface\s+\w+\s*{[^}]*}/g, '');
  
  // Remove type assertions
  content = content.replace(/as\s+\w+/g, '');
  
  // Remove colon type annotations
  content = content.replace(/:\s*\w+(\[\])?/g, '');
  content = content.replace(/:\s*{\s*[^}]*\s*}/g, '');
  content = content.replace(/:\s*\(.*?\)\s*=>/g, '');
  
  // Remove angled bracket type parameters
  content = content.replace(/<[^>]*>/g, '');
  
  // Remove React.FC type
  content = content.replace(/React\.FC(\<.*?\>)?/g, '');
  
  // Fix double semicolons that might be left
  content = content.replace(/;;/g, ';');
  
  return content;
}

// Create directory for JavaScript files
function createJsConfig() {
  console.log('Creating jsconfig.json');
  
  const jsConfig = {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "*": ["src/*"]
      },
      "jsx": "react-jsx",
      "module": "esnext",
      "target": "es2020",
      "moduleResolution": "bundler"
    },
    "include": ["src"]
  };
  
  fs.writeFileSync('jsconfig.json', JSON.stringify(jsConfig, null, 2));
}

// Update package.json to remove TypeScript dependencies
function updatePackageJson() {
  console.log('Updating package.json');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Remove TypeScript-related dependencies
  const depsToRemove = [
    '@types/react',
    '@types/react-dom',
    'typescript',
    'typescript-eslint'
  ];
  
  for (const dep of depsToRemove) {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      delete packageJson.dependencies[dep];
    }
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      delete packageJson.devDependencies[dep];
    }
  }
  
  // Update ESLint config if necessary
  if (packageJson.eslintConfig) {
    delete packageJson.eslintConfig.parser;
    if (packageJson.eslintConfig.plugins) {
      packageJson.eslintConfig.plugins = packageJson.eslintConfig.plugins.filter(
        plugin => !plugin.includes('typescript')
      );
    }
  }
  
  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

// Update Vite config
function updateViteConfig() {
  console.log('Updating Vite config');
  
  const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
  if (fs.existsSync(viteConfigPath)) {
    let content = fs.readFileSync(viteConfigPath, 'utf8');
    
    // Remove TypeScript references
    content = content.replace(/import.*?from\s+['"].*?\.ts['"]/g, match => 
      match.replace('.ts', '.js'));
    
    // Write as JavaScript file
    fs.writeFileSync('vite.config.js', content);
    fs.unlinkSync(viteConfigPath);
  }
}

// Main function
function main() {
  console.log('Converting TypeScript project to JavaScript...');
  
  // Process each directory
  for (const dir of dirsToProcess) {
    if (fs.existsSync(dir)) {
      processDirectory(dir);
    }
  }
  
  // Create jsconfig.json
  createJsConfig();
  
  // Update package.json
  updatePackageJson();
  
  // Update Vite config
  updateViteConfig();
  
  // Remove TypeScript config files
  const tsConfigFiles = ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json'];
  for (const file of tsConfigFiles) {
    if (fs.existsSync(file)) {
      console.log(`Removing: ${file}`);
      fs.unlinkSync(file);
    }
  }
  
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Conversion complete! The project is now using JavaScript instead of TypeScript.');
}

main(); 