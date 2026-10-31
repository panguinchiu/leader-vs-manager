import { SHEET_URL } from './config';
import { QUESTIONS } from './quiz-data';

// Fire-and-forget: never awaited by the UI.
export function sendToSheet({ name, grade, answers, scores, dimScores, persona }) {
  if (!SHEET_URL) return;
  const payload = {
    timestamp: new Date().toISOString(),
    name,
    grade,
    answers: QUESTIONS.map((q, i) => {
      const a = answers.find((x) => x.questionIndex === i);
      return a ? ['A', 'B', 'C', 'D'][a.optionIndex] : '';
    }),
    leaderScore: scores.leader,
    managerScore: scores.manager,
    leaderPct: persona.leaderPct,
    dimScores,
    personaType: persona.key,
    personaTitle: persona.title,
  };
  try {
    fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).catch((e) => console.error('Sheet submit error:', e));
  } catch (e) {
    console.error('Sheet submit error:', e);
  }
}

export function encodeResult(r) {
  const json = JSON.stringify(r);
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function decodeResult(s) {
  try {
    const b = s.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(b))));
  } catch { return null; }
}
