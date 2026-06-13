/**
 * wellnessEngine.ts
 * 
 * The core analytical engine of ExamEase AI.
 * Parses mood, stress, sleep, study hours, and journal text to identify
 * potential stress triggers (e.g. parental pressure, backlog, fear of failure).
 * Generates natural, supportive, and actionable mindfulness guidance
 * tailored to the student's selected exam context.
 * 
 * Code Quality Updates: Uses explicit return types, imports trigger configurations
 * and advice texts from constants, and avoids magic strings.
 */

import { CheckIn, WellnessInsights } from './types';
import { scanForCrisis } from './safety';
import { TRIGGER_RULES, COPING_STRATEGIES, DEFAULT_STRATEGY } from './constants';

/**
 * Analyzes check-in data to produce diagnostic insights.
 * 
 * @param checkIn The CheckIn data containing mood, stress, sleep, study, and text
 * @returns WellnessInsights detailing risk level, triggers, and wellness advice
 */
export function analyzeCheckIn(checkIn: CheckIn): WellnessInsights {
  // First, run safety scan to detect crisis keywords
  const safetyCheck = scanForCrisis(checkIn.journalText);

  // Compile triggers
  const detectedTriggersSet = new Set<string>();
  const journalTextLower = checkIn.journalText.toLowerCase();

  // 1. Text-based keyword triggers
  TRIGGER_RULES.forEach(rule => {
    const matchesKeyword = rule.keywords.some(keyword => journalTextLower.includes(keyword));
    if (matchesKeyword) {
      detectedTriggersSet.add(rule.key);
    }
  });

  // 2. Numerical metric-based triggers (Using thresholds defined by standard inputs)
  if (checkIn.sleepHours < 6) {
    detectedTriggersSet.add('lack of sleep');
  }
  if (checkIn.studyHours > 12) {
    detectedTriggersSet.add('burnout');
  }
  if (checkIn.stress >= 8) {
    detectedTriggersSet.add('exam anxiety');
  }

  const detectedTriggers: string[] = Array.from(detectedTriggersSet);

  // 3. Determine Risk Level
  // Mood (1 is worst, 10 is best) and Stress (1 is best, 10 is worst)
  let riskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
  
  if (checkIn.stress >= 8 || checkIn.mood <= 3 || safetyCheck.isCrisis) {
    riskLevel = 'High';
  } else if (checkIn.stress >= 5 || checkIn.mood <= 6 || detectedTriggers.length >= 3) {
    riskLevel = 'Moderate';
  }

  // 4. Generate Coping Strategy & Mindfulness Exercise
  // Retrieve coping content matching the first detected trigger, or fallback to default
  let copingStrategy: string = DEFAULT_STRATEGY.strategy;
  let mindfulnessExercise: string = DEFAULT_STRATEGY.exercise;

  if (detectedTriggers.length > 0) {
    const primaryTrigger = detectedTriggers[0];
    if (COPING_STRATEGIES[primaryTrigger]) {
      copingStrategy = COPING_STRATEGIES[primaryTrigger].strategy;
      mindfulnessExercise = COPING_STRATEGIES[primaryTrigger].exercise;
    }
  }

  // 5. Generate Emotional Pattern
  let emotionalPattern = '';
  if (checkIn.mood >= 8 && checkIn.stress <= 3) {
    emotionalPattern = `You are maintaining an excellent emotional state despite preparing for a high-stakes exam like ${checkIn.examType}. Your mood is high (${checkIn.mood}/10), and stress levels are low. Keep maintaining this healthy balance!`;
  } else if (checkIn.stress >= 7) {
    emotionalPattern = `Your stress levels are elevated (${checkIn.stress}/10). The academic pressure for ${checkIn.examType} is manifesting as noticeable emotional strain. Your journal entries indicate stress signals that warrant immediate mindfulness interventions.`;
  } else if (checkIn.mood <= 4) {
    emotionalPattern = `Your mood score is currently low (${checkIn.mood}/10). High-stakes preparation can lead to emotional exhaustion. This indicates a potential dip in motivation or energy that requires a gentle rest and mental recharge.`;
  } else {
    emotionalPattern = `You are in a moderate emotional zone. Stress is currently manageable, and mood is stable. However, preparing for ${checkIn.examType} brings hidden fluctuations; maintaining consistent self-care will keep you resilient.`;
  }

  // 6. Generate Motivational Encouragement
  let motivationalEncouragement = '';
  if (detectedTriggers.includes('fear of failure')) {
    motivationalEncouragement = `Remember: Your value as a person is infinitely greater than any rank in ${checkIn.examType}. A single exam does not define your potential, your intelligence, or your future. Take a breath and trust the hard work you have put in.`;
  } else if (detectedTriggers.includes('burnout')) {
    motivationalEncouragement = `Studying until you break is not productivity; it is counter-productive. Rest is a part of your preparation. Give yourself permission to pause, breathe, and sleep tonight. You are running a marathon, not a sprint!`;
  } else {
    motivationalEncouragement = `Preparing for ${checkIn.examType} is one of the toughest academic phases. The fact that you are standing up to this challenge every day shows immense strength. Keep going, take it one day at a time, and remember to be kind to yourself.`;
  }

  // 7. Generate Study Wellness Recommendation
  let studyWellnessRecommendation = '';
  if (checkIn.sleepHours < 6) {
    studyWellnessRecommendation = `URGENT: Your sleep duration is ${checkIn.sleepHours} hours. This is critically low. Lack of sleep directly impairs active recall, concentration, and emotional control. We recommend cutting study hours by 1-2 hours if needed to guarantee at least 7 hours of sleep.`;
  } else if (checkIn.studyHours > 14) {
    studyWellnessRecommendation = `Your study time is ${checkIn.studyHours} hours, which borders on excessive. Studies show cognitive retention drops steeply after 10 hours of active mental exertion. Integrate a mandatory 10-minute break every 50 minutes using the Pomodoro technique to prevent neural fatigue.`;
  } else if (checkIn.sleepHours >= 7 && checkIn.studyHours >= 6 && checkIn.studyHours <= 10) {
    studyWellnessRecommendation = `Your sleep (${checkIn.sleepHours}h) and study (${checkIn.studyHours}h) balance is highly optimized! This schedule supports long-term memory consolidation and high cognitive performance. Maintain this template.`;
  } else {
    studyWellnessRecommendation = `Aim for a balanced routine: 7-8 hours of sleep, 6-10 hours of focused study with short active breaks, and at least 30 minutes of physical movement or open air relaxation daily.`;
  }

  return {
    riskLevel,
    detectedTriggers: detectedTriggers.map(t => {
      const rule = TRIGGER_RULES.find(r => r.key === t);
      return rule ? rule.label : t;
    }),
    emotionalPattern,
    copingStrategy,
    mindfulnessExercise,
    motivationalEncouragement,
    studyWellnessRecommendation,
    hasCrisis: safetyCheck.isCrisis
  };
}
