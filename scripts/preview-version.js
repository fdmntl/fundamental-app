const semanticRelease = require('semantic-release');

(async () => {
  const result = await semanticRelease({
    dryRun: true,
    noCi: true,
    branches: ['+([0-9A-Za-z-])?(.)*'],
    plugins: [
      ['@semantic-release/commit-analyzer', {
        preset: 'conventionalcommits',
        releaseRules: [
          { type: 'add', release: 'minor' },
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'docs', release: false },
          { type: 'style', release: false },
          { type: 'refactor', release: false },
          { type: 'perf', release: false },
          { type: 'test', release: false },
          { breaking: true, release: 'major' }
        ]
      }],
      '@semantic-release/release-notes-generator'
    ]
  });

  if (result) {
    console.log(result.nextRelease.version);
  } else {
    console.log('No version will be released.');
  }
}).catch(error => {
      console.error('Error during semantic release:', error);
      process.exit(1);
    });