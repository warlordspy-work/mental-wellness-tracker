/**
 * storage.test.ts
 * 
 * Tests check-in serialization, storage retrieval, statistic compilations,
 * and database clearing using JSDOM's localStorage environment.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { saveCheckIn, loadCheckIns, clearAllData, calculateStats, isUsingTemporaryCache } from '../lib/storage';
import { CheckIn } from '../lib/types';

describe('storage - Client Database Operations', () => {

  const testLog1: CheckIn = {
    id: 'log-101',
    timestamp: '2026-06-12T10:00:00.000Z',
    examType: 'NEET',
    examDate: '2026-07-15',
    mood: 8,
    stress: 4,
    sleepHours: 7.5,
    studyHours: 8,
    journalText: 'Felt good, study target completed.'
  };

  const testLog2: CheckIn = {
    id: 'log-102',
    timestamp: '2026-06-13T10:00:00.000Z',
    examType: 'NEET',
    examDate: '2026-07-15',
    mood: 4,
    stress: 8,
    sleepHours: 5.5,
    studyHours: 10,
    journalText: 'Very tired. Mock exam was difficult.'
  };

  // Clear local storage sandbox before each test block
  beforeEach(() => {
    clearAllData();
  });

  it('should load an empty array when no logs exist', () => {
    const logs = loadCheckIns();
    expect(logs).toEqual([]);
  });

  it('should save and retrieve check-in entries correctly', () => {
    saveCheckIn(testLog1);
    const logs = loadCheckIns();
    expect(logs).toHaveLength(1);
    expect(logs[0].id).toBe('log-101');
    expect(logs[0].mood).toBe(8);
  });

  it('should maintain check-ins sorted latest first (prepend)', () => {
    saveCheckIn(testLog1);
    saveCheckIn(testLog2);
    
    const logs = loadCheckIns();
    expect(logs).toHaveLength(2);
    // testLog2 should be index 0 since it was saved second (most recent)
    expect(logs[0].id).toBe('log-102');
    expect(logs[1].id).toBe('log-101');
  });

  it('should compute exact statistical averages', () => {
    saveCheckIn(testLog1); // mood: 8, stress: 4, sleep: 7.5, study: 8
    saveCheckIn(testLog2); // mood: 4, stress: 8, sleep: 5.5, study: 10

    const stats = calculateStats();
    expect(stats.totalCheckIns).toBe(2);
    expect(stats.averageMood).toBe(6); // (8 + 4) / 2
    expect(stats.averageStress).toBe(6); // (4 + 8) / 2
    expect(stats.averageSleep).toBe(6.5); // (7.5 + 5.5) / 2
    expect(stats.averageStudy).toBe(9); // (8 + 10) / 2
  });

  it('should clear all stored logs', () => {
    saveCheckIn(testLog1);
    saveCheckIn(testLog2);
    
    clearAllData();
    const logs = loadCheckIns();
    expect(logs).toEqual([]);
    
    const stats = calculateStats();
    expect(stats.totalCheckIns).toBe(0);
  });

  it('should handle QuotaExceededError and set temporary cache flag', () => {
    // If window or window.localStorage is not defined, local storage was already blocked
    if (typeof window === 'undefined' || !window.localStorage) {
      expect(isUsingTemporaryCache).toBe(true);
      return;
    }
    
    const originalSetItem = window.localStorage.setItem;
    
    // Mock setItem to throw QuotaExceededError DOMException
    window.localStorage.setItem = () => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    };
    
    try {
      saveCheckIn(testLog1);
      
      // Should fall back to memory store and mark the temporary cache flag true
      expect(isUsingTemporaryCache).toBe(true);
      const logs = loadCheckIns();
      expect(logs).toHaveLength(1);
      expect(logs[0].id).toBe('log-101');
    } finally {
      // Restore original setItem
      window.localStorage.setItem = originalSetItem;
    }
  });

});

