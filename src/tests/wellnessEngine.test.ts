/**
 * wellnessEngine.test.ts
 * 
 * Verifies trigger detection accuracy and stress level assignments
 * under various student logs in the wellnessEngine.
 */

import { describe, it, expect } from 'vitest';
import { analyzeCheckIn } from '../lib/wellnessEngine';
import { CheckIn } from '../lib/types';

describe('wellnessEngine - Stress Analysis Logic', () => {
  
  // Base check-in template to extend in tests
  const baseCheckIn: CheckIn = {
    id: 'test-1',
    timestamp: new Date().toISOString(),
    examType: 'JEE',
    examDate: '',
    mood: 7,
    stress: 3,
    sleepHours: 8,
    studyHours: 6,
    journalText: 'Normal day of study, revised chemistry.'
  };

  it('should evaluate low risk for healthy configurations', () => {
    const analysis = analyzeCheckIn(baseCheckIn);
    expect(analysis.riskLevel).toBe('Low');
    expect(analysis.detectedTriggers).toHaveLength(0);
    expect(analysis.hasCrisis).toBe(false);
  });

  it('should detect syllabus backlog trigger and classify risk', () => {
    const input: CheckIn = {
      ...baseCheckIn,
      journalText: 'I have a huge backlog in physics chapters. I am so behind in syllabus coverage.'
    };
    const analysis = analyzeCheckIn(input);
    expect(analysis.detectedTriggers).toContain('Syllabus Backlog');
    expect(analysis.riskLevel).toBe('Low'); // Only 1 trigger, mood 7, stress 3
  });

  it('should trigger lack of sleep when sleepHours is below 6', () => {
    const input: CheckIn = {
      ...baseCheckIn,
      sleepHours: 5
    };
    const analysis = analyzeCheckIn(input);
    expect(analysis.detectedTriggers).toContain('Sleep Deprivation');
  });

  it('should evaluate High Risk for extreme stress score', () => {
    const input: CheckIn = {
      ...baseCheckIn,
      stress: 9,
      mood: 4
    };
    const analysis = analyzeCheckIn(input);
    expect(analysis.riskLevel).toBe('High');
  });

  it('should evaluate Moderate Risk when triggers exceed 3 items', () => {
    // 3 triggers: parental pressure, peer comparison, and backlog keywords
    const input: CheckIn = {
      ...baseCheckIn,
      journalText: 'My parents are disappointed in me. My friends are doing way better, and my syllabus backlog is huge.'
    };
    const analysis = analyzeCheckIn(input);
    expect(analysis.detectedTriggers).toContain('Parental Expectations');
    expect(analysis.detectedTriggers).toContain('Peer Comparison');
    expect(analysis.detectedTriggers).toContain('Syllabus Backlog');
    expect(analysis.riskLevel).toBe('Moderate');
  });

  it('should flags mock test triggers and apply matching coping exercises', () => {
    const input: CheckIn = {
      ...baseCheckIn,
      journalText: 'Scored poorly in today mock test paper series.'
    };
    const analysis = analyzeCheckIn(input);
    expect(analysis.detectedTriggers).toContain('Mock Test Pressure');
    expect(analysis.copingStrategy.toLowerCase()).toContain('mock tests');
  });

});
