import { schedule } from 'danger';

import { istanbulCoverage } from 'danger-plugin-istanbul-coverage';

schedule(
  istanbulCoverage({
    reportFileSet: 'all',
    threshold: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
  })
);
