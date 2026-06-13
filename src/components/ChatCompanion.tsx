/**
 * ChatCompanion.tsx
 * 
 * Chat interface simulating a wellness companion.
 * Integrates keyword safety triggers, provides exam-grounded empathetic advice,
 * and maintains complete client-side chat logs.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../lib/types';
import { scanForCrisis } from '../lib/safety';

interface ChatCompanionProps {
  examType: string;
}

export const ChatCompanion: React.FC<ChatCompanionProps> = ({ examType }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your ExamEase AI Wellness Companion. I am here to help you navigate the academic pressure of preparing for ${examType || 'your high-stakes exams'}. How are you feeling today? Tell me about your prep, mock exams, or study routine.`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      return;
    }

    const userMessageText = inputValue.trim();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Safety Layer Check
    const safetyCheck = scanForCrisis(userMessageText);

    setTimeout(() => {
      let responseText = '';
      let isCrisis = false;

      if (safetyCheck.isCrisis) {
        isCrisis = true;
        responseText = `⚠️ **Critical Support Message:** ${safetyCheck.message}\n\n**Confidential Helplines:**\n` + 
          `- Vandrevala Foundation Helpline: **9999 666 555**\n` +
          `- Kiran Mental Health Helpline: **1800-599-0019**\n` +
          `- AASRA Suicide Helpline: **91-9820466726**\n\nPlease reach out to them or a trusted adult immediately. I am an AI companion, not an emergency clinical service.`;
      } else {
        // Empathetic response generation based on keyword scanning
        const textLower = userMessageText.toLowerCase();
        
        if (textLower.includes('mock') || textLower.includes('test') || textLower.includes('score') || textLower.includes('marks')) {
          responseText = `I understand how overwhelming mock test marks can be during ${examType} prep. Remember that mocks are only diagnostic exercises designed to reveal subject gaps, not a prediction of your final score. \n\n*Actionable strategy:* Try focusing on your 'Mistake Logbook' rather than the aggregate percentile. Review 3 questions you got wrong and master their concepts today. You've got this!`;
        } else if (textLower.includes('sleep') || textLower.includes('tired') || textLower.includes('exhausted') || textLower.includes('insomnia')) {
          responseText = `Sleep deprivation is a massive cognitive bottleneck for ${examType} candidates. Memory retention and analytical speed drop by over 30% when sleeping under 6 hours. \n\n*Actionable strategy:* Set a hard cutoff for study materials at least 45 minutes before bedtime. Practice the 4-7-8 breathing method to quiet your mind before sleeping tonight.`;
        } else if (textLower.includes('focus') || textLower.includes('distract') || textLower.includes('phone') || textLower.includes('social media')) {
          responseText = `Distractions during long study blocks are completely natural. Instead of fighting it with sheer willpower, change your study environment. \n\n*Actionable strategy:* Use the Pomodoro Technique. Set a timer for 25 minutes of high-focus study with all notifications silenced, followed by a mandatory 5-minute movement break. It lowers study fatigue significantly.`;
        } else if (textLower.includes('parent') || textLower.includes('expectation') || textLower.includes('family') || textLower.includes('mom') || textLower.includes('dad')) {
          responseText = `Navigating family expectations alongside ${examType} preparation adds a heavy emotional layer. Most parents express concern because they care about your future, even if it feels like pressure. \n\n*Actionable strategy:* Share your daily routine or effort instead of scores. Letting them know, "I did 8 hours of focused revision today," reassures them of your dedication and can build mutual trust.`;
        } else if (textLower.includes('backlog') || textLower.includes('behind') || textLower.includes('syllabus')) {
          responseText = `Having a backlog is one of the most common stressors in ${examType} prep. Try to avoid the urge to rush. Attempting to cover everything at once often leads to poor retention. \n\n*Actionable strategy:* Allocate a 20% slice of your study schedule strictly to backlog clearing (e.g. 1.5 hours daily), while keeping the rest focused on current topics. This stops the backlog from expanding.`;
        } else {
          responseText = `Thank you for sharing that. Preparing for an exam like ${examType} is a demanding journey. It is completely normal to feel stretched, but taking it one subject block at a time makes it manageable. \n\n*Actionable strategy:* Write down your top 3 small goals for today and cross them off as you finish. Keep the scope tight. Remember to take a 10-minute walk to refresh. I am here to support you!`;
        }
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toISOString(),
        isCrisis
      };

      setMessages(prev => [...prev, assistantMsg]);
    }, 600); // Small delay to simulate AI thinking
  };

  return (
    <section 
      className="card" 
      aria-labelledby="chat-heading"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '500px',
        maxWidth: '650px',
        margin: '0 auto',
        padding: '0'
      }}
    >
      {/* Header section of Chat Card */}
      <div 
        style={{
          padding: 'var(--spacing-md)',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-primary-light)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)'
        }}
      >
        <h2 id="chat-heading" style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-primary)' }}>
          💬 Empathetic AI Companion
        </h2>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
          Chat about your exam concerns. (Context: {examType} preparation)
        </p>
      </div>

      {/* Messages List Area */}
      <div 
        role="log"
        aria-live="polite"
        style={{
          flex: 1,
          padding: 'var(--spacing-md)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)',
          backgroundColor: '#fafcfb'
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {/* Bubble details */}
            <div 
              style={{
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: msg.isCrisis 
                  ? 'var(--color-risk-high-bg)' 
                  : msg.sender === 'user' 
                    ? 'var(--color-primary)' 
                    : 'var(--color-surface)',
                color: msg.isCrisis 
                  ? 'var(--color-risk-high)' 
                  : msg.sender === 'user' 
                    ? '#ffffff' 
                    : 'var(--color-text)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--color-border)',
                whiteSpace: 'pre-line',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.95rem'
              }}
            >
              {msg.text}
            </div>

            {/* Timestamp & Sender */}
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '4px', padding: '0 4px' }}>
              {msg.sender === 'user' ? 'You' : 'Companion'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Footer */}
      <form 
        onSubmit={handleSendMessage}
        style={{
          display: 'flex',
          padding: 'var(--spacing-md)',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          borderBottomLeftRadius: 'var(--radius-lg)',
          borderBottomRightRadius: 'var(--radius-lg)',
          gap: 'var(--spacing-sm)'
        }}
      >
        <div style={{ flex: 1 }}>
          <label htmlFor="chat-input" className="sr-only">Type your academic concern here</label>
          <input
            type="text"
            id="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="E.g., I'm feeling stressed about mock tests..."
            autoComplete="off"
            style={{ width: '100%', height: '44px' }}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ height: '44px', padding: '0 var(--spacing-lg)' }}
          aria-label="Send message to wellness companion"
        >
          Send
        </button>
      </form>
    </section>
  );
};
