const { validateReadmeTemplate } = require('../index');

(async () => {
  try {
    const ok = await validateReadmeTemplate();
    console.log('Validation result:', ok);
  } catch (err) {
    console.error('Validation failed:', err.message);
    process.exitCode = 1;
  }
})();
