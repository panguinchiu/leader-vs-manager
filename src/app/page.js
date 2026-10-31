'use client';

import { useState, useEffect } from 'react';
import { QUESTIONS, PERSONAS, DIMENSION_LABELS, getPersona } from '../lib/quiz-data';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const [screen, setScreen] = useState('intro'); // 'intro' | 'quiz' | 'result'
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState({ leader: 0, manager: 0 });
  const [dimScores, setDimScores] = useState({
    personality: { leader: 0, manager: 0 },
    goals: { leader: 0, manager: 0 },
    work: { leader: 0, manager: 0 },
    relationship: { leader: 0, manager: 0 },
    identity: { leader: 0, manager: 0 },
  });
  const [resultId, setResultId] = useState(null);
  const [persona, setPersona] = useState(null);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const [roastOpen, setRoastOpen] = useState(false);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [formError, setFormError] = useState('');

  // Animate bars when result screen shows
  useEffect(() => {
    if (screen === 'result') {
      const timer = setTimeout(() => setBarsAnimated(true), 100);
      return () => clearTimeout(timer);
    } else {
      setBarsAnimated(false);
    }
  }, [screen]);

  function startQuiz() {
    if (!name.trim()) { setFormError('請填寫姓名'); return; }
    if (!grade) { setFormError('請選擇年級'); return; }
    setFormError('');
    setScreen('quiz');
    setCurrentQ(0);
    setAnswers([]);
    setScores({ leader: 0, manager: 0 });
    setDimScores({
      personality: { leader: 0, manager: 0 },
      goals: { leader: 0, manager: 0 },
      work: { leader: 0, manager: 0 },
      relationship: { leader: 0, manager: 0 },
      identity: { leader: 0, manager: 0 },
    });
  }

  async function handleOptionClick(questionIndex, optionIndex) {
    const question = QUESTIONS[questionIndex];
    const option = question.options[optionIndex];

    const newScores = {
      leader: scores.leader + option.score.leader,
      manager: scores.manager + option.score.manager,
    };

    const newDimScores = { ...dimScores };
    const dk = question.dimKey;
    newDimScores[dk] = {
      leader: (newDimScores[dk]?.leader || 0) + option.score.leader,
      manager: (newDimScores[dk]?.manager || 0) + option.score.manager,
    };

    const newAnswers = [
      ...answers,
      { questionIndex, optionIndex, score: option.score },
    ];

    setScores(newScores);
    setDimScores(newDimScores);
    setAnswers(newAnswers);

    if (questionIndex < QUESTIONS.length - 1) {
      setCurrentQ(questionIndex + 1);
    } else {
      // Quiz complete — submit and show result
      const personaResult = getPersona(newScores.leader, newScores.manager);
      setPersona(personaResult);

      try {
        const res = await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: newAnswers,
            scores: newScores,
            dimScores: newDimScores,
            personaType: personaResult.key,
            leaderPct: personaResult.leaderPct,
            name,
            grade,
          }),
        });
        const data = await res.json();
        if (data.id) {
          setResultId(data.id);
          // Update URL without navigating
          window.history.pushState({}, '', `/result/${data.id}`);
        }
      } catch (e) {
        console.error('Submit error:', e);
      }

      setScreen('result');
    }
  }

  function handleGoBack() {
    if (currentQ === 0) return;
    const lastAnswer = answers[answers.length - 1];
    const prevQ = QUESTIONS[lastAnswer.questionIndex];
    setAnswers(prev => prev.slice(0, -1));
    setScores(prev => ({
      leader: prev.leader - lastAnswer.score.leader,
      manager: prev.manager - lastAnswer.score.manager,
    }));
    setDimScores(prev => ({
      ...prev,
      [prevQ.dimKey]: {
        leader: prev[prevQ.dimKey].leader - lastAnswer.score.leader,
        manager: prev[prevQ.dimKey].manager - lastAnswer.score.manager,
      },
    }));
    setCurrentQ(prev => prev - 1);
  }

  function handleRetake() {
    window.history.pushState({}, '', '/');
    setScreen('intro');
    setResultId(null);
    setPersona(null);
    setRoastOpen(false);
    setName('');
    setGrade('');
    setFormError('');
  }

  function handleShare() {
    if (resultId) {
      const url = `${window.location.origin}/result/${resultId}`;
      navigator.clipboard.writeText(url).then(() => {
        setShareMsg('連結已複製！');
        setTimeout(() => setShareMsg(''), 2500);
      }).catch(() => {
        setShareMsg(url);
      });
    }
  }

  function getPikminSVG(type) {
    const colors = {
      'pikmin-red':    { body: '#e63946', leaf: '#2d6a4f', eye: '#fff', pupil: '#1a1a1a', nose: '#ffb4a2', stem: '#52b788' },
      'pikmin-yellow': { body: '#f4a261', leaf: '#2d6a4f', eye: '#fff', pupil: '#1a1a1a', nose: '#ffe66d', stem: '#52b788' },
      'pikmin-blue':   { body: '#457b9d', leaf: '#2d6a4f', eye: '#fff', pupil: '#1a1a1a', nose: '#a8dadc', stem: '#52b788' },
      'pikmin-purple': { body: '#7b2d8b', leaf: '#2d6a4f', eye: '#fff', pupil: '#1a1a1a', nose: '#dda0dd', stem: '#52b788' },
      'pikmin-white':  { body: '#e8e0d4', leaf: '#2d6a4f', eye: '#c23b22', pupil: '#c23b22', nose: '#f5f0e8', stem: '#52b788' },
    };
    const c = colors[type] || colors['pikmin-red'];
    return `<svg viewBox="0 0 88 110" xmlns="http://www.w3.org/2000/svg">
      <path d="M44 18 Q42 8, 44 2 Q46 8, 44 18" fill="${c.stem}" stroke="${c.stem}" stroke-width="1.5"/>
      <ellipse cx="44" cy="3" rx="10" ry="5" fill="${c.leaf}" transform="rotate(-15 44 3)"/>
      <line x1="44" y1="3" x2="38" y2="5" stroke="${c.stem}" stroke-width="0.8" opacity="0.6"/>
      <ellipse cx="44" cy="55" rx="22" ry="30" fill="${c.body}"/>
      <ellipse cx="38" cy="48" rx="8" ry="12" fill="rgba(255,255,255,0.12)"/>
      <ellipse cx="36" cy="44" rx="6.5" ry="7.5" fill="${c.eye}"/>
      <ellipse cx="52" cy="44" rx="6.5" ry="7.5" fill="${c.eye}"/>
      <ellipse cx="37" cy="45" rx="3.5" ry="4" fill="${c.pupil}"/>
      <ellipse cx="53" cy="45" rx="3.5" ry="4" fill="${c.pupil}"/>
      <circle cx="35" cy="43" r="1.5" fill="#fff" opacity="0.9"/>
      <circle cx="51" cy="43" r="1.5" fill="#fff" opacity="0.9"/>
      <ellipse cx="44" cy="54" rx="5" ry="4" fill="${c.nose}"/>
      <path d="M39 60 Q44 64, 49 60" fill="none" stroke="${c.pupil}" stroke-width="1.2" stroke-linecap="round"/>
      <ellipse cx="34" cy="84" rx="9" ry="4" fill="${c.body}" opacity="0.85"/>
      <ellipse cx="54" cy="84" rx="9" ry="4" fill="${c.body}" opacity="0.85"/>
      <path d="M22 50 Q16 56, 18 64" fill="none" stroke="${c.body}" stroke-width="4" stroke-linecap="round"/>
      <path d="M66 50 Q72 56, 70 64" fill="none" stroke="${c.body}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="18" cy="65" r="3.5" fill="${c.body}"/>
      <circle cx="70" cy="65" r="3.5" fill="${c.body}"/>
    </svg>`;
  }

  function getDimPct(dimKey, type) {
    const d = dimScores[dimKey];
    if (!d) return 0;
    const total = d.leader + d.manager;
    if (total === 0) return 50;
    return Math.round((d[type] / total) * 100);
  }

  // ---- INTRO SCREEN ----
  if (screen === 'intro') {
    return (
      <>
        <div className="top-bar">
          <span className="site-label">心理測驗 · Psychology Quiz</span>
          <span>Vol. 2024</span>
        </div>
        <div className="container">
          <div className="intro-header">
            <div className="intro-kicker">Leadership Psychology Assessment</div>
            <h1 className="intro-title">
              你是<em>領導人</em><br />vs. <em>經理人</em>？
            </h1>
            <div className="intro-divider" />
            <p className="intro-description">
              透過 10 個真實情境，探索你在面對挑戰、決策、人際關係時的本能反應，
              揭示你內在的管理風格與領導特質。
            </p>
            <div className="intro-meta">
              <span>📝 10 道情境題</span>
              <span>⏱ 約 5 分鐘</span>
              <span>🎯 5 種人格類型</span>
            </div>
            <div className="user-info-form">
              <div className="user-info-row">
                <div className="user-info-field">
                  <label htmlFor="field-grade">年級 <span className="required">*</span></label>
                  <select
                    id="field-grade"
                    value={grade}
                    onChange={e => { setGrade(e.target.value); setFormError(''); }}
                  >
                    <option value="">請選擇年級</option>
                    <option value="111級">111級</option>
                    <option value="112級">112級</option>
                    <option value="113級">113級</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div className="user-info-field">
                  <label htmlFor="field-name">姓名 <span className="required">*</span></label>
                  <input
                    id="field-name"
                    type="text"
                    placeholder="請輸入姓名"
                    value={name}
                    onChange={e => { setName(e.target.value); setFormError(''); }}
                  />
                </div>
              </div>
              {formError && <div className="form-error">{formError}</div>}
            </div>

            <button className="btn-start" onClick={startQuiz}>
              開始測驗
            </button>
          </div>
          <div style={{ padding: '40px 0', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', textAlign: 'center', lineHeight: '1.8' }}>
              本測驗基於領導力心理學研究設計，結果僅供個人參考與自我探索之用。<br />
              每一種人格類型都有其獨特的優勢，沒有絕對的好壞之分。
            </p>
          </div>
        </div>
      </>
    );
  }

  // ---- QUIZ SCREEN ----
  if (screen === 'quiz') {
    const question = QUESTIONS[currentQ];
    const progress = Math.round((currentQ / QUESTIONS.length) * 100);

    return (
      <>
        <div className="top-bar">
          <span className="site-label">心理測驗 · Psychology Quiz</span>
          <span>{currentQ + 1} / {QUESTIONS.length}</span>
        </div>
        <div className="container">
          <div className="quiz-wrapper">
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">進度</span>
                <span className="progress-label">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="question-section">
              <div className="question-meta">
                <span className="question-num">第 {currentQ + 1} 題</span>
                <span style={{ color: 'var(--muted)', fontSize: '12px' }}>·</span>
                <span className="question-dim">{question.dimension}</span>
              </div>
              <p className="question-text">{question.text}</p>

              <ul className="options-list">
                {question.options.map((option, idx) => (
                  <li key={idx}>
                    <button
                      className="option-btn"
                      onClick={() => handleOptionClick(currentQ, idx)}
                    >
                      <span className="option-letter">{OPTION_LETTERS[idx]}</span>
                      <span className="option-text">{option.text}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {currentQ > 0 && (
                <div className="quiz-back-wrap">
                  <button className="btn-prev" onClick={handleGoBack}>
                    ← 前一題
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ---- RESULT SCREEN ----
  if (screen === 'result' && persona) {
    const total = scores.leader + scores.manager;

    return (
      <>
        <div className="top-bar">
          <span className="site-label">心理測驗 · Psychology Quiz</span>
          <span>測驗結果</span>
        </div>
        <div className="container">
          <div className="result-wrapper">
            <div className="result-header">
              <div className={`result-type-badge ${persona.type}`}>
                {persona.type === 'leader' ? '領導人型' : '經理人型'}
              </div>
              <h1 className="result-title">{persona.title}</h1>
              <p className="result-label">{persona.label}</p>
            </div>

            {/* Dimension bars */}
            <div className="dimensions-section">
              <div className="section-heading">各維度分析</div>
              {Object.keys(DIMENSION_LABELS).map((dk) => {
                const d = dimScores[dk] || { leader: 0, manager: 0 };
                const dtotal = d.leader + d.manager;
                const lPct = dtotal > 0 ? Math.round((d.leader / dtotal) * 100) : 50;
                const isLeader = lPct >= 50;
                return (
                  <div className="dim-row" key={dk}>
                    <span className="dim-label">{DIMENSION_LABELS[dk]}</span>
                    <div className="dim-bar-container">
                      <div
                        className={`dim-bar-fill ${isLeader ? '' : 'manager'}`}
                        style={{ width: barsAnimated ? `${isLeader ? lPct : 100 - lPct}%` : '0%' }}
                      />
                    </div>
                    <span className="dim-pct" style={{ color: isLeader ? 'var(--leader-color)' : 'var(--manager-color)' }}>
                      {isLeader ? lPct : 100 - lPct}%
                    </span>
                  </div>
                );
              })}
              <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '12px', color: 'var(--muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'var(--leader-color)', display: 'inline-block' }} />
                  領導人傾向
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'var(--manager-color)', display: 'inline-block' }} />
                  經理人傾向
                </span>
              </div>
            </div>

            {/* Overall score */}
            <div className="card-section" style={{ marginBottom: '32px' }}>
              <div className="section-heading">整體比例</div>
              <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'var(--font-serif)', color: 'var(--leader-color)' }}>
                    {total > 0 ? Math.round((scores.leader / total) * 100) : 50}%
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '1px' }}>領導人</div>
                </div>
                <div style={{ flex: 1, height: '12px', background: 'var(--border)', position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: barsAnimated ? `${total > 0 ? Math.round((scores.leader / total) * 100) : 50}%` : '0%',
                    background: 'var(--leader-color)',
                    transition: 'width 1s ease',
                  }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'var(--font-serif)', color: 'var(--manager-color)' }}>
                    {total > 0 ? Math.round((scores.manager / total) * 100) : 50}%
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '1px' }}>經理人</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <div className="section-heading">關於你的類型</div>
              <p className="description-text">{persona.description}</p>
            </div>

            {/* MBTI */}
            <div className="mbti-section">
              <div className="mbti-label">MBTI 連結</div>
              <p className="mbti-text">{persona.mbti}</p>
            </div>

            {/* Persona card */}
            <div className="section-heading" style={{ marginBottom: '16px' }}>對應人物</div>
            <div className="persona-card">
              <div className="persona-emoji">{persona.personaEmoji}</div>
              <div className="persona-info">
                <div className="persona-name">{persona.personaName}</div>
                <div className="persona-role">{persona.personaRole}</div>
                <p className="persona-quote">{persona.personaQuote}</p>
              </div>
            </div>

            {/* Roast Card */}
            <div className="roast-trigger-wrap">
              <div className="roast-trigger-hint">測驗到這裡就結束了⋯⋯嗎？</div>
              {!roastOpen && (
                <button className="btn-roast" onClick={() => {
                  setRoastOpen(true);
                  setTimeout(() => {
                    document.getElementById('roast-collapse')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 150);
                }}>
                  <span className="roast-emoji">🫣</span> 想聽真心話嗎？
                </button>
              )}
            </div>

            <div id="roast-collapse" className={`roast-collapse${roastOpen ? ' open' : ''}`}>
              <div className="roast-card">
                <div className="roast-warning">⚠️ 真心話時間 — 以下內容可能引起不適（但很好笑）</div>
                <div className="roast-inner">
                  <div
                    className="roast-pikmin"
                    dangerouslySetInnerHTML={{ __html: getPikminSVG(persona.roastIcon) }}
                  />
                  <div className="roast-content">
                    <div className="roast-title">「{persona.roastTitle}」</div>
                    <div className="roast-subtitle">▸ 你的皮克敏真心話</div>
                    <div className="roast-body">{persona.roastBody}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="result-actions">
              <button className="btn-retake" onClick={handleRetake}>
                重新測驗
              </button>
              {resultId && (
                <button className="btn-share" onClick={handleShare}>
                  {shareMsg || '分享結果'}
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
