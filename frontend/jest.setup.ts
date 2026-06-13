// Initialize i18next for the test environment.
// In the app this happens in pages/_app.tsx via `import '../i18n'`,
// but component tests render components directly, so we initialize it here
// to make `t()` return translations instead of raw keys.
import './i18n';

// Custom jest matchers from @testing-library/jest-dom (e.g. toBeInTheDocument).
import '@testing-library/jest-dom';
