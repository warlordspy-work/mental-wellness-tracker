/**
 * wellnessEngine.ts
 * 
 * The core analytical engine of ExamEase AI.
 * Parses mood, stress, sleep, study hours, and journal text to identify
 * potential stress triggers (e.g. parental pressure, backlog, fear of failure).
 * Generates natural, supportive, and actionable mindfulness guidance
 * tailored to the student's selected exam context.
 */

import { CheckIn, WellnessInsights } from './types';
import { scanForCrisis } from './safety';

// Define the structure of trigger detection rules
interface TriggerRule {
  key: string;
  label: string;
  keywords: string[];
}

// Map triggers to keyword lists for lexical matching
const TRIGGER_RULES: TriggerRule[] = [
  {
    key: 'mock test',
    label: 'Mock Test Pressure',
    keywords: ['mock', 'test series', 'practice test', 'exam paper', 'test paper', 'mocks', 'marks', 'score']
  },
  {
    key: 'low marks',
    label: 'Academic Performance Concern',
    keywords: ['low marks', 'bad score', 'failed', 'scoring low', 'poor grade', 'failing', 'marks did not', 'percentile']
  },
  {
    key: 'parental pressure',
    label: 'Parental Expectations',
    keywords: ['parent', 'parents', 'father', 'mother', 'family', 'mom', 'dad', 'expectations', 'expectation', 'disappoint']
  },
  {
    key: 'comparison',
    label: 'Peer Comparison',
    keywords: ['friend', 'classmate', 'rank', 'peers', 'relative', 'others are', 'everyone else', 'compared', 'topper']
  },
  {
    key: 'lack of sleep',
    label: 'Sleep Deprivation',
    keywords: ['sleep', 'tired', 'insomnia', 'exhausted', 'sleepy', 'awake all night', 'fatigue', 'slept']
  },
  {
    key: 'backlog',
    label: 'Syllabus Backlog',
    keywords: ['backlog', 'behind', 'syllabus', 'incomplete', 'portion', 'cover up', 'chapters left', 'revision', 'revising']
  },
  {
    key: 'fear of failure',
    label: 'Fear of Failure',
    keywords: ['fail', 'what if', 'cannot clear', 'won\'t clear', 'wont clear', 'scared', 'fear', 'dread', 'rejection']
  },
  {
    key: 'procrastination',
    label: 'Procrastination Cycle',
    keywords: ['procrastinate', 'wasted time', 'distracted', 'phone', 'lazy', 'delay', 'tomorrow', 'procrastinating', 'distraction']
  },
  {
    key: 'burnout',
    label: 'Study Burnout',
    keywords: ['burnout', 'give up', 'can\'t do this', 'cant do this', 'exhausted', 'drained', 'no energy', 'done with', 'overwhelmed', 'giving up']
  },
  {
    key: 'loneliness',
    label: 'Social Isolation',
    keywords: ['alone', 'lonely', 'no one', 'isolated', 'nobody', 'friendless', 'no friends', 'isolating']
  },
  {
    key: 'exam anxiety',
    label: 'Pre-Exam Anxiety',
    keywords: ['anxious', 'panic', 'worry', 'stress', 'nervous', 'scared', 'heart beating', 'sweating', 'jittery', 'overthinking']
  },
  {
    key: 'time pressure',
    label: 'Time Crunch',
    keywords: ['time', 'clock', 'days left', 'hurry', 'running out', 'schedule', 'deadline', 'fast', 'countdown', 'weeks left']
  }
];

// Contextual Coping Strategies based on primary detected triggers
const COPING_STRATEGIES: Record<string, { strategy: string; exercise: string }> = {
  'mock test': {
    strategy: 'De-couple self-worth from scorecards. Mock tests are diagnostic tools, not final judgments. Review the mistakes without emotional self-flagellation.',
    exercise: 'The 5-Minute Post-Mock Review: Write down 3 things you did well in the test first, then list 3 specific concepts to review. File the score away and move to concept-mapping.'
  },
  'low marks': {
    strategy: 'Shift focus from outcomes to processes. Create a "Mistake Logbook". Classify errors into: Silly Mistakes, Concept Gaps, and Time Management Issues.',
    exercise: 'Error Decoupling Exercise: Write the mistake on a card. On the back, write the concept solution. Keep it as a learning flashcard rather than a failure symbol.'
  },
  'parental pressure': {
    strategy: 'Establish a gentle, clear boundary. Understand that parental worry is often misplaced love. Try to share your effort level rather than just your score updates.',
    exercise: 'The Grounded Communication Script: Take a few slow deep breaths, then draft a short message or verbal response: "I am working hard and doing my best. I need support and quiet study hours to perform well."'
  },
  'comparison': {
    strategy: 'Remember that peer comparisons are highly distorted. You only see their achievements, not their struggles. Measure your progress against your own past self.',
    exercise: 'Personal Progress Log: Note down three concepts you struggled with 2 weeks ago that you understand better today. Celebrate this incremental growth.'
  },
  'lack of sleep': {
    strategy: 'Prioritize sleep hygiene. Sleep is not lost study time; it is when memory consolidation happens. A sleep-deprived brain operates with reduced cognitive capacity.',
    exercise: 'The "No Screens" Wind-Down: Switch off all screens 30 minutes before sleep. Read a physical text or practice 4-7-8 breathing in bed to signal your nervous system to rest.'
  },
  'backlog': {
    strategy: 'Avoid the "all-or-nothing" trap. Divide the backlog into high-weightage topics first. Allocate 75% of your time to current topics and 25% to backlogs.',
    exercise: 'The 20-Minute Focus Sprint: Select a single backlog topic. Set a timer for 20 minutes, study ONLY that topic, then rest for 5 minutes. Small steps break backlog paralysis.'
  },
  'fear of failure': {
    strategy: 'Label the fear. Fear thrives on ambiguity. Ask yourself: "What is the absolute worst case, and what would I do next?" Usually, life has multiple paths to success.',
    exercise: 'The "Worst-Case/Best-Case" Balance: Write down the worst-case scenario. Then write the absolute best-case scenario. Finally, write the most likely scenario. Notice how the middle path is manageable.'
  },
  'procrastination': {
    strategy: 'Forgive your past procrastination; guilt fuels more delay. Lower the activation energy. Don\'t plan to study for 4 hours; plan to open your book for 5 minutes.',
    exercise: 'The 5-Minute Rule: Commit to studying a topic for just 5 minutes. If you want to stop after 5 minutes, you can. 90% of the time, the momentum keeps you going.'
  },
  'burnout': {
    strategy: 'Recognize that burnout requires active recovery, not just passive rest. Take a full half-day off. Recharge without feeling guilty; rest is a strategic requirement.',
    exercise: 'The Digital Detox Walk: Spend 15 minutes walking outdoors without your phone or study notes. Focus your attention on the trees, air, and sounds around you.'
  },
  'loneliness': {
    strategy: 'High-stakes prep can be isolating. Schedule a 10-minute social touchpoint daily—a quick call with a friend, a study partner, or a brief conversation with a family member.',
    exercise: 'The Connection Reach-Out: Send a quick message to a friend or classmate simply saying: "Hey, hope your prep is going well! Let\'s catch up for 5 mins later."'
  },
  'exam anxiety': {
    strategy: 'Anxiety is a physical state. When heart rates go up, cognitive bandwidth shrinks. Calm your body to calm your mind. Use deep breathing to activate the vagus nerve.',
    exercise: 'Box Breathing: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold empty for 4 seconds. Repeat this cycle 4 times to regulate heart rate.'
  },
  'time pressure': {
    strategy: 'Time is fixed, but energy is manageable. Focus on high-yield topics (80/20 rule). A well-reviewed 70% of the syllabus is better than an unrevised 100%.',
    exercise: 'Urgency Matrix Triage: Make a list of today\'s tasks. Mark only two as "Critical" (Must Do). Focus solely on these two before looking at secondary tasks.'
  }
};

// Default strategies if no specific triggers match
const DEFAULT_STRATEGY = {
  strategy: 'Maintain a consistent daily study routine balanced with regular breaks. Keep tracking your mood to notice early signs of academic stress.',
  exercise: 'Progressive Muscle Relaxation (PMR): Tense each muscle group (shoulders, arms, legs) for 5 seconds, then release completely. Notice the physical relief.'
};

/**
 * Analyzes check-in data to produce GenAI-style diagnostic insights.
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

  // 2. Numerical metric-based triggers
  if (checkIn.sleepHours < 6) {
    detectedTriggersSet.add('lack of sleep');
  }
  if (checkIn.studyHours > 12) {
    detectedTriggersSet.add('burnout');
  }
  if (checkIn.stress >= 8) {
    detectedTriggersSet.add('exam anxiety');
  }

  const detectedTriggers = Array.from(detectedTriggersSet);

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
  let copingStrategy = DEFAULT_STRATEGY.strategy;
  let mindfulnessExercise = DEFAULT_STRATEGY.exercise;

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
