# Security Policy — ExamEase AI

We take the privacy and security of students extremely seriously. This document outlines the security architecture, data handling models, and responsible AI safeguards built into **ExamEase AI**.

---

## 🔒 1. Privacy & Zero-Data-Transmission Architecture
* **No Backend Services:** ExamEase AI has no remote servers, databases, or API integrations. All calculations, analysis, and rendering happen client-side in the user's browser.
* **No Third-Party Tracking:** We do not embed analytics tracking cookies, advertising scripts, or social widgets. Your usage is 100% confidential.
* **Browser Sandbox Confinement:** All data logs are saved strictly in `localStorage` inside the browser's sandbox. Data never leaves your machine.

---

## 🔑 2. No API Keys or Secrets
* **Deterministic Analysis Engine:** The wellness insights and triggers are generated deterministically in the local browser bundle. 
* **Zero Secrets Committed:** Because we do not invoke external Generative AI web requests (which are prone to key exposure and network interception), the repository contains zero active API credentials, `.env` files, or cloud tokens.

---

## ⚠️ 3. Crisis Monitoring & Safety Filters
* **Distress Scanning:** The application scans journal inputs and chat dialogs for key self-harm and crisis phrases.
* **Helpline Redirection:** If a crisis is flagged, standard wellness suggestions are immediately overwritten with clear references to emergency mental health crisis services (Vandrevala Foundation, AASRA Lifeline, and Kiran Government Lifelines).
* **Scope Definition:** ExamEase AI explicitly presents itself as an educational self-tracking tool and includes repeated visible disclaimers that it cannot replace qualified clinical or psychiatric care.

---

## 🛠️ 4. Input Sanitization & Threat Mitigation
* **Anti-DOS String Capping:** We enforce strict character length caps (2000 characters for journal text, 500 characters for chat concerns) to prevent buffer overflows or memory leaks in client-side arrays.
* **Control-Character Stripping:** Inputs are normalized to remove invisible binary control characters, defending the DOM tree from formatting anomalies.
* **No dangereous HTML execution:** User inputs are rendered as standard string text nodes. The codebase completely avoids the use of `dangerouslySetInnerHTML` or raw script evaluations.

---

## 💾 5. Quota & Private Browsing Safeguards
* **Storage Protection:** The database wrapper checks for storage quota limits (`QuotaExceededError`) and private browsing storage locks.
* **In-Memory Fallback:** If writing to `localStorage` fails due to browser configuration blocks, the app seamlessly falls back to an in-memory dictionary to protect runtime execution and prevent app crashes.
