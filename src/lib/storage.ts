/**
 * storage.ts
 * 
 * Manages the persistence of student check-ins entirely client-side using localStorage.
 * Provides utility functions to retrieve check-in histories, calculate wellness statistics,
 * export JSON files, and clear student records.
 */

import { CheckIn, WellnessStats } from './types';
import { analyzeCheckIn } from './wellnessEngine';

const STORAGE_KEY = 'examease_checkins';

// In-memory fallback database for test setups and constrained environments
let memoryStore: Record<string, string> = {};

function getItem(key: string): string | null {
  try {
    return typeof localStorage !== 'undefined' && localStorage ? localStorage.getItem(key) : memoryStore[key] || null;
  } catch {
    return memoryStore[key] || null;
  }
}

function setItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.setItem(key, value);
    } else {
      memoryStore[key] = value;
    }
  } catch {
    memoryStore[key] = value;
  }
}

function removeItem(key: string): void {
  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.removeItem(key);
    } else {
      delete memoryStore[key];
    }
  } catch {
    delete memoryStore[key];
  }
}

/**
 * Saves a new check-in to localStorage.
 * Prepends the new check-in so that index 0 is always the latest entry.
 * 
 * @param checkIn The CheckIn object to save
 */
export function saveCheckIn(checkIn: CheckIn): void {
  try {
    const checkIns = loadCheckIns();
    checkIns.unshift(checkIn); // Add to the beginning of the array
    setItem(STORAGE_KEY, JSON.stringify(checkIns));
  } catch (error) {
    console.error('Failed to save check-in:', error);
  }
}

/**
 * Loads all check-ins from localStorage.
 * Returns an empty array if no check-ins exist.
 * 
 * @returns Array of CheckIn objects sorted latest to oldest
 */
export function loadCheckIns(): CheckIn[] {
  try {
    const rawData = getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }
    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Failed to load check-ins:', error);
    return [];
  }
}

/**
 * Deletes all check-ins from localStorage.
 */
export function clearAllData(): void {
  try {
    removeItem(STORAGE_KEY);
    memoryStore = {}; // Purge the in-memory store too
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}

/**
 * Calculates aggregate wellness statistics over all past check-ins.
 * Returns defaults if no check-ins are present.
 * 
 * @returns WellnessStats object
 */
export function calculateStats(): WellnessStats {
  const checkIns = loadCheckIns();
  const count = checkIns.length;

  if (count === 0) {
    return {
      totalCheckIns: 0,
      averageMood: 0,
      averageStress: 0,
      averageSleep: 0,
      averageStudy: 0,
      mostCommonTrigger: 'None',
      latestRiskLevel: 'N/A',
      latestRecommendation: 'No check-in data available. Complete your first check-in to generate insights.'
    };
  }

  // Calculate averages
  let sumMood = 0;
  let sumStress = 0;
  let sumSleep = 0;
  let sumStudy = 0;

  // Track frequencies of detected triggers
  const triggerFrequencies: Record<string, number> = {};

  checkIns.forEach(entry => {
    sumMood += entry.mood;
    sumStress += entry.stress;
    sumSleep += entry.sleepHours;
    sumStudy += entry.studyHours;

    // Run wellness engine on each check-in to extract triggers
    const analysis = analyzeCheckIn(entry);
    analysis.detectedTriggers.forEach(trigger => {
      triggerFrequencies[trigger] = (triggerFrequencies[trigger] || 0) + 1;
    });
  });

  // Determine the most common trigger
  let mostCommonTrigger = 'None';
  let maxCount = 0;
  Object.entries(triggerFrequencies).forEach(([trigger, freq]) => {
    if (freq > maxCount) {
      maxCount = freq;
      mostCommonTrigger = trigger;
    }
  });

  // Retrieve latest entry details
  const latestEntry = checkIns[0];
  const latestAnalysis = analyzeCheckIn(latestEntry);

  return {
    totalCheckIns: count,
    averageMood: Math.round((sumMood / count) * 10) / 10,
    averageStress: Math.round((sumStress / count) * 10) / 10,
    averageSleep: Math.round((sumSleep / count) * 10) / 10,
    averageStudy: Math.round((sumStudy / count) * 10) / 10,
    mostCommonTrigger,
    latestRiskLevel: latestAnalysis.riskLevel,
    latestRecommendation: latestAnalysis.studyWellnessRecommendation
  };
}

/**
 * Returns a JSON string of all check-in data, suitable for download.
 * 
 * @returns JSON string of all check-ins
 */
export function exportCheckInsJSON(): string {
  const checkIns = loadCheckIns();
  return JSON.stringify(checkIns, null, 2);
}
