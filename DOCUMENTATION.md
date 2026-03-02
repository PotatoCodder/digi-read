# DETAILED TECHNICAL DOCUMENTATION: DIGI-READ SYSTEM

## 1. Project Specifications
*   **Application Name:** Digi-Read
*   **Language:** TypeScript (Strict Mode)
*   **Framework:** Next.js 16 (App Router Architecture)
*   **Rendering:** Client-Side Rendering (CSR) for Voice/Animations, Server-Side for static SEO.
*   **Primary Core Library:** `react-speech-recognition` (wrapper for Web Speech API).
*   **Secondary Libraries:** GSAP (Animation Logic), Framer Motion (State-based UI Transitions).

---

## 2. Comprehensive Directory Structure
Individual files and their specific responsibilities:

### `/app` Directory (Routes)
*   `read/page.tsx`: The orchestrator. Manages classroom state (English vs Filipino) and injects `passageId` into the tracker.
*   `layout.tsx`: Defines the root HTML, Google Fonts (Geist), and global shared components (Navbar/Footer).
*   `api/scores/route.ts`: (Internal) Handles the persistence of reading scores via Prisma ORM.

### `/components` Directory (Logic & UI)
*   `layout/features/SpeechRecognition.tsx`: **The Engine.** Contains the Levenshtein algorithm, fuzzy matcher, and real-time DOM tracking.
*   `layout/features/readingResult.tsx`: The analytic dashboard. Calculates final performance metrics.
*   `layout/hero.tsx`: The aesthetic entry point using high-performance Tailwind 4 & Framer Motion.

---

## 3. Deep Dive: Core Functions Analysis

### A. Fuzzy Match Engine (`isMatch`)
This is the most critical function in the system. It enables the app to be "forgiving"—allowing for diverse accents and speech recognition hallucinations.

```typescript
const isMatch = (spoken: string, expected: string) => {
  // Step 1: Normalize internal strings by stripping all special characters
  const normSpoken = spoken.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normExpected = expected.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // Step 2: Exact check for speed
  if (normSpoken === normExpected) return true;
  
  // Step 3: Strict check for short words (avoids hallucination on 'is', 'at', etc.)
  if (normExpected.length <= 3 && normSpoken !== normExpected) return false;
  
  // Step 4: Calculate Edit Distance
  // Tolerance formula: 1 mistake allowed per 3 chars + 1 base mistake
  const maxDistance = Math.floor(normExpected.length / 3) + 1;
  return levenshtein(normSpoken, normExpected) <= maxDistance;
};
```

### B. Levenshtein Distance Algorithm
Implemented as a dynamic programming matrix to compare string similarities.

```typescript
const levenshtein = (a: string, b: string): number => {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
            matrix[j][i - 1] + 1,        // deletion
            matrix[j - 1][i] + 1,        // insertion
            matrix[j - 1][i - 1] + indicator // substitution
        );
    }
  }
  return matrix[b.length][a.length];
};
```

### C. Real-Time Tracking Loop (`useEffect`)
This loop processes the `transcript` variable from the Web Speech API every time a new word is recognized.

```typescript
useEffect(() => {
  if (!transcript) return;
  // Convert spoken stream into an array for comparison
  const spokenWords = transcript.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  
  let spokenIdx = 0;
  let passageIdx = 0;
  const LOOKAHEAD_WINDOW = 5; // Distance to search to recover from skipped words

  while (spokenIdx < spokenWords.length && passageIdx < words.length) {
    if (isMatch(spokenWords[spokenIdx], words[passageIdx])) {
        // Success: Word marked as 'correct'
        wStatus[passageIdx] = 'correct';
        passageIdx++;
        spokenIdx++;
    } else {
        // Lookahead Logic: Check if user skipped words
        // If the current spoken word matches a word 1-5 slots ahead,
        // we mark the intermediate words as 'wrong' and jump forward.
        // This keeps the tracker perfectly synced even if the user stutters.
    }
  }
}, [transcript]);
```

---

## 4. MonkeyType UI Implementation
To achieve the "Premium Typing Feel," the system uses specific CSS-in-JS logic:

1.  **Cursor/Caret:** The active word contains a relative-positioned `motion.span` that animates a vertical blue bar.
2.  **Word Coloring:** 
    *   `unread`: `text-slate-400`
    *   `correct`: `text-slate-800 font-semibold`
    *   `wrong`: `text-red-500 line-through`
3.  **Centered Auto-Scrolling:**
    ```typescript
    activeWordRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    ```
    This ensures that the user's focus is never broken by manual scrolling—the passage moves with their voice.

---

## 5. Deployment and Operations
The system utilizes **Next.js 16** optimized build pipelines. 
*   **Run Dev:** `npm run dev`
*   **Production Build:** `npm run build` (This triggers `prisma generate` to ensure type-safe database access).
*   **Environment:** Powered by `.env` variables for PostgreSQL connectivity.

---
*End of Documentation*
