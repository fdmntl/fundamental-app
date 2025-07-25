const fs = require('fs');
const path = require('path');

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Missing version argument');
  process.exit(1);
}

// 1. Update package.json
const pkgPath = path.resolve('package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// 2. Update both package-lock.json files
['package-lock.json', 'path/to/second/package-lock.json'].forEach((lockPath) => {
  const absPath = path.resolve(lockPath);
  if (fs.existsSync(absPath)) {
    const lock = JSON.parse(fs.readFileSync(absPath, 'utf-8'));
    lock.version = newVersion;
    fs.writeFileSync(absPath, JSON.stringify(lock, null, 2) + '\n');
  } else {
    console.warn(`Skipped missing lockfile: ${lockPath}`);
  }
});

// 3. Update app.config.js
const appConfigPath = path.resolve('app.config.js');
let appConfigContent = fs.readFileSync(appConfigPath, 'utf-8');
appConfigContent = appConfigContent.replace(
  /version:\s*['"`]\d+\.\d+\.\d+['"`]/,
  `version: '${newVersion}'`
);
fs.writeFileSync(appConfigPath, appConfigContent);

console.log(`✔ Updated version to ${newVersion}`);
