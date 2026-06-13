/**
 * safety.test.ts
 * 
 * Verifies safety filter logic. Scans for crisis and self-harm keywords,
 * ensuring warning overrides and helpline lists trigger correctly.
 */

import { describe, it, expect } from 'vitest';
import { scanForCrisis } from '../lib/safety';

describe('safety - Crisis Filter Scan', () => {

  it('should pass normal journaling text without crisis flags', () => {
    const normalText = 'Today was a productive day. I revised 3 chapters of biology and solved some physics questions.';
    const result = scanForCrisis(normalText);
    expect(result.isCrisis).toBe(false);
    expect(result.message).toBeUndefined();
    expect(result.helplines).toBeUndefined();
  });

  it('should detect explicit crisis phrases', () => {
    const crisisText = 'I am under too much pressure and I feel like I want to kill myself, it is too hard.';
    const result = scanForCrisis(crisisText);
    expect(result.isCrisis).toBe(true);
    expect(result.message).toContain('support available');
    expect(result.helplines).toBeDefined();
    expect(result.helplines?.length).toBeGreaterThan(0);
  });

  it('should detect crisis triggers case-insensitively', () => {
    const uppercaseCrisis = 'SUICIDAL thoughts are keeping me awake all night.';
    const result = scanForCrisis(uppercaseCrisis);
    expect(result.isCrisis).toBe(true);
  });

  it('should handle empty or undefined entries gracefully', () => {
    const emptyResult = scanForCrisis('');
    expect(emptyResult.isCrisis).toBe(false);
  });

});
