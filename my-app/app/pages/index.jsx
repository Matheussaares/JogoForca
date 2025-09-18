"use client"; // Adicione essa linha aqui

import React, { useEffect, useState, useRef } from "react";

const WORDS = [
  "REACT","JAVASCRIPT","NEXT","COMPONENTE","ESTADO","PROPS","HOOKS","FUNCTION","ASYNC",
  "VARIAVEL","PROGRAMACAO","ALGORITMO","GITHUB","TYPESCRIPT","NODE","FRONTEND","BACKEND",
  "ESTILOS","CSS","HTML","DOM","EVENTO","TESTES","DEPLOY","SERVIDOR","CLIENTE","ROTAS",
  "BUILD","PACKAGE","NPM","YARN","WEBPACK"
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Home() {
  const [word, setWord] = useState(chooseRandomWord);
  const [revealed, setRevealed] = useState(new Set());
  const [wrong, setWrong] = useState(new Set());
  const [maxErrors] = useState(6);
  const [status, setStatus] = useState("playing");
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    evaluateStatus();
    if (inputRef.current) inputRef.current.focus();
  }, [revealed, wrong]);

  function resetGame() {
    setWord(chooseRandomWord());
    setRevealed(new Set());
    setWrong(new Set());
    setStatus("playing");
    setInput("");
    if (inputRef.current) inputRef.current.focus();
  }

  function handleGuessLetter(letter) {
    if (status !== "playing") return;
    const L = letter.toUpperCase();
    if (revealed.has(L) || wrong.has(L)) return;

    if (word.includes(L)) {
      const next = new Set(revealed);
      for (const ch of word) if (ch === L) next.add(L);
      setRevealed(next);
    } else {
      const nextWrong = new Set(wrong);
      nextWrong.add(L);
      setWrong(nextWrong);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const value = input.trim().toUpperCase();
    if (!value) return;
    const letter = value[0];
    if (!/^[A-Z]$/.test(letter)) {
      setInput("");
      return;
    }
    handleGuessLetter(letter);
    setInput("");
    if (inputRef.current) inputRef.current.focus();
  }

  function evaluateStatus() {
    const uniqueLetters = new Set(word.split(""));
    const revealedAll = Array.from(uniqueLetters).every(l => revealed.has(l));
    if (revealedAll) {
      setStatus("won");
      return;
    }
    if (wrong.size >= maxErrors) {
      setStatus("lost");
      return;
    }
    setStatus("playing");
  }

  const attemptsLeft = Math.max(0, maxErrors - wrong.size);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Jogo da Forca</h1>
        <div style={styles.gameArea}>
          <div style={styles.hangmanBox}>
            <HangmanSVG wrongCount={wrong.size} />
            <p style={styles.attempts}>Tentativas restantes: <strong>{attemptsLeft}</strong></p>
          </div>
          <div style={styles.panel}>
            <p style={styles.label}>Palavra:</p>
            <div style={styles.wordDisplay} aria-live="polite">
              {Array.from(word).map((ch, idx) => (
                <span key={idx} style={styles.letterBox}>
                  {revealed.has(ch) || status === "lost" ? ch : "_"}
                </span>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                ref={inputRef}
                aria-label="Digite uma letra"
                maxLength={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={styles.input}
                disabled={status !== "playing"}
              />
              <button style={styles.button} type="submit" disabled={status !== "playing"}>Enviar</button>
              <button type="button" onClick={resetGame} style={styles.resetButton}>Reiniciar</button>
            </form>

            <div style={styles.keyboard} aria-hidden={status !== "playing"}>
              {ALPHABET.map((L) => {
                const used = revealed.has(L) || wrong.has(L);
                const isWrong = wrong.has(L);
                return (
                  <button
                    key={L}
                    onClick={() => handleGuessLetter(L)}
                    disabled={used || status !== "playing"}
                    style={{
                      ...styles.key,
                      ...(used ? (isWrong ? styles.keyWrong : styles.keyCorrect) : {})
                    }}
                  >
                    {L}
                  </button>
                );
              })}
          </div>

            <div style={styles.attemptsList}>
              <p>Letras tentadas:</p>
              <div style={styles.triedBox}>
                {Array.from(new Set([...revealed, ...wrong])).length === 0 && <span style={styles.empty}>Nenhuma letra ainda.</span>}
                {Array.from(revealed).map(l => (
                  <span key={l} style={styles.triedCorrect}>{l}</span>
                ))}
                {Array.from(wrong).map(l => (
                  <span key={l} style={styles.triedWrong}>{l}</span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {status === "won" && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <h2>Parabéns! Você venceu 🎉</h2>
              <p>A palavra era <strong>{word}</strong></p>
              <button onClick={resetGame} style={styles.button}>Jogar novamente</button>
            </div>
          </div>
        )}

        {status === "lost" && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <h2>Fim de jogo 😞</h2>
              <p>A palavra era <strong>{word}</strong></p>
              <button onClick={resetGame} style={styles.button}>Tentar outra</button>
            </div>
          </div>
        )}

        <footer style={styles.footer}>Dica: use o teclado virtual ou digite uma letra e pressione Enviar.</footer>
      </div>
    </main>
  );
}

function chooseRandomWord() {
  const w = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
  return w.replace(/[^A-Z]/g, "");
}

function HangmanSVG({ wrongCount }) {
  return (
    <svg width="220" height="260" viewBox="0 0 220 260" style={{display:'block'}} aria-hidden>
      <line x1="20" y1="240" x2="200" y2="240" stroke="#222" strokeWidth="6" />
      <line x1="60" y1="240" x2="60" y2="20" stroke="#222" strokeWidth="6" />
      <line x1="60" y1="20" x2="150" y2="20" stroke="#222" strokeWidth="6" />
      <line x1="150" y1="20" x2="150" y2="40" stroke="#222" strokeWidth="6" />
      {wrongCount > 0 && <circle cx="150" cy="60" r="18" stroke="#222" strokeWidth="4" fill="none" />}
      {wrongCount > 1 && <line x1="150" y1="78" x2="150" y2="140" stroke="#222" strokeWidth="4" />}
      {wrongCount > 2 && <line x1="150" y1="95" x2="125" y2="115" stroke="#222" strokeWidth="4" />}
      {wrongCount > 3 && <line x1="150" y1="95" x2="175" y2="115" stroke="#222" strokeWidth="4" />}
      {wrongCount > 4 && <line x1="150" y1="140" x2="130" y2="180" stroke="#222" strokeWidth="4" />}
      {wrongCount > 5 && <line x1="150" y1="140" x2="170" y2="180" stroke="#222" strokeWidth="4" />}
    </svg>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#0f1724,#071028)', color: '#e6eef8', padding: '24px' },
  container: { width: '100%', maxWidth: '1100px', background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', borderRadius: '12px', boxShadow: '0 8px 30px rgba(2,6,23,0.7)', padding: '24px' },
  title: { margin: 0, padding: 0, fontSize: '28px', fontWeight: 700, color: '#ffd166' },
  gameArea: { display: 'flex', gap: '20px', marginTop: '18px' },
  hangmanBox: { flex: '0 0 260px', textAlign: 'center', padding: '10px' },
  panel: { flex: 1, padding: '8px' },
  label: { margin: 0, color: '#94a3b8' },
  wordDisplay: { display: 'flex', gap: '10px', padding: '12px 0', flexWrap: 'wrap' },
  letterBox: { display: 'inline-block', minWidth: '28px', borderBottom: '2px solid #2b6cb0', textAlign: 'center', fontSize: '20px', padding: '6px 2px' },
  form: { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' },
  input: { width: '56px', padding: '8px', fontSize: '18px', borderRadius: '6px', border: '1px solid #2b6cb0', background: 'transparent', color: '#e6eef8' },
  button: { padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: '#06b6d4', color: '#062024', fontWeight: 700 },
  resetButton: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: '#ffd166', cursor: 'pointer' },
  keyboard: { marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(13,1fr)', gap: '8px' },
  key: { padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: 'transparent', color: '#e6eef8', cursor: 'pointer' },
  keyCorrect: { background: '#16a34a', color: '#062020', border: 'none' },
  keyWrong: { background: '#ef4444', color: '#fff', border: 'none' },
  attempts: { marginTop: '8px', color: '#94a3b8' },
  attemptsList: { marginTop: '14px' },
  triedBox: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' },
  triedCorrect: { padding: '6px 8px', borderRadius: '6px', background: '#064e3b', color: '#a7f3d0', fontWeight: 700 },
  triedWrong: { padding: '6px 8px', borderRadius: '6px', background: '#7f1d1d', color: '#fecaca', fontWeight: 700 },
  empty: { color: '#94a3b8' },
  overlay: { position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' },
  modal: { background: '#011627', padding: '24px', borderRadius: '12px', textAlign: 'center', color: '#fff', minWidth: '320px' },
  footer: { marginTop: '12px', color: '#94a3b8', textAlign: 'center' }
};