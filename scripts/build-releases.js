import { exec } from 'child_process';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildReleases() {
  const clientDir = resolve(__dirname, '../../watchdog-client');
  const releaseDir = join(__dirname, '../releases');
  
  // Create releases directory
  await fsPromises.mkdir(releaseDir, { recursive: true });
  
  // Create Windows release
  const windowsZip = archiver('zip');
  const windowsOutput = fs.createWriteStream(join(releaseDir, 'watchdog-client-windows.zip'));
  
  windowsZip.pipe(windowsOutput);
  windowsZip.directory(clientDir, 'watchdog-client');
  await windowsZip.finalize();
  
  // Create macOS release
  const macZip = archiver('zip');
  const macOutput = fs.createWriteStream(join(releaseDir, 'watchdog-client-mac.zip'));
  
  macZip.pipe(macOutput);
  macZip.directory(clientDir, 'watchdog-client');
  await macZip.finalize();
  
  console.log('Release packages created successfully');
}

buildReleases();