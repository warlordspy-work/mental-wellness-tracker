/**
 * setup.ts
 * 
 * Configures the testing environment for Vitest.
 * Imports custom matchers from jest-dom for DOM testing.
 * Mocks unsupported DOM APIs in JSDOM, such as scrollIntoView.
 */

import '@testing-library/jest-dom';

// JSDOM does not implement scrollIntoView. We mock it globally to prevent
// tests in ChatCompanion from throwing exceptions.
window.HTMLElement.prototype.scrollIntoView = function() {};
