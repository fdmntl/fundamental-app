const fs = require('fs');

const releasePreviewPath = 'release-preview.txt';

function extractVersionChange(text) {
  const current = text.match(/The last release was ".*?" on branch .* with a git tag of "v?(.*?)"/);
  const next = text.match(/The next release version is (\d+\.\d+\.\d+(-\w+\.\d+)*)/);

  if (next) {
    const currentVersion = current?.[1] || 'none';
    const nextVersion = next[1];
    return `${currentVersion} --> ${nextVersion}`;
  } else {
    return 'No version bump suggested.';
  }
}

function main() {
  try {
    const output = fs.readFileSync(releasePreviewPath, 'utf-8');
    const result = extractVersionChange(output);
    console.log(result);
  } catch (err) {
    console.error('Failed to read release-preview.txt:', err.message);
    process.exit(1);
  }
}

main();
