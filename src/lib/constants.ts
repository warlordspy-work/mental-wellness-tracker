/**
 * constants.ts
 * 
 * Declares immutable application-wide constants for ExamEase AI.
 * Centralizing strings, bounds, safety keywords, and error templates
 * prevents duplication, eliminates magic strings, and increases code maintainability.
 */

import { SafetyCheckResult } from './safety';

export const INPUT_LIMITS = {
  JOURNAL_MAX_LENGTH: 2000,
  CHAT_MESSAGE_MAX_LENGTH: 500,
  MIN_JOURNAL_LENGTH: 5
};

export const RATING_BOUNDS = {
  MIN_MOOD: 1,
  MAX_MOOD: 10,
  MIN_STRESS: 1,
  MAX_STRESS: 10,
  MAX_SLEEP_HOURS: 24,
  MAX_STUDY_HOURS: 24,
  WARNING_SLEEP_HOURS: 16,
  WARNING_STUDY_HOURS: 20
};

export const CRISIS_KEYWORDS: string[] = [
  'suicide',
  'suicidal',
  'kill myself',
  'end my life',
  'want to die',
  'self-harm',
  'self harm',
  'hurt myself',
  'cutting myself',
  'ending it all',
  'better off dead',
  'don\'t want to live',
  'dont want to live',
  'take my life',
  'overdose'
];

export const CRISIS_HELPLINES = [
  {
    name: 'Vandrevala Foundation Helpline (India)',
    contact: '9999 666 555',
    details: 'Available 24/7, confidential mental health support and crisis counseling.'
  },
  {
    name: 'Kiran Mental Health Helpline (Govt of India)',
    contact: '1800-599-0019',
    details: '24/7 free and confidential mental health support.'
  },
  {
    name: 'AASRA Helpline (India)',
    contact: '91-9820466726',
    details: '24/7 suicide prevention and emotional support lifeline.'
  },
  {
    name: 'National Suicide Prevention Lifeline (US/Global)',
    contact: '988 / 1-800-273-8255',
    details: '24/7 free and confidential support for people in distress.'
  }
];

export const CRISIS_RESPONSE: SafetyCheckResult = {
  isCrisis: true,
  message: `It sounds like you're going through an incredibly difficult time, but please know that you are not alone and there is support available right now. Your life is valuable, and there are people who want to listen and help you through this. Please reach out to a professional counselor, a trusted adult, or contact a dedicated helpline immediately. ExamEase AI is a supportive tracker and is not a replacement for professional crisis or emergency care.`,
  helplines: CRISIS_HELPLINES
};

export interface TriggerRule {
  key: string;
  label: string;
  keywords: string[];
}

export const TRIGGER_RULES: TriggerRule[] = [
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

export const COPING_STRATEGIES: Record<string, { strategy: string; exercise: string }> = {
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

export const DEFAULT_STRATEGY = {
  strategy: 'Maintain a consistent daily study routine balanced with regular breaks. Keep tracking your mood to notice early signs of academic stress.',
  exercise: 'Progressive Muscle Relaxation (PMR): Tense each muscle group (shoulders, arms, legs) for 5 seconds, then release completely. Notice the physical relief.'
};

export const RESPONSIBLE_AI_NOTE = 'Responsible AI Note: ExamEase AI provides rule-based simulations based on cognitive behavioral models to support students. These recommendations are educational and do not constitute clinical, psychiatric, or medical advice.';
