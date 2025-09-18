"use client";
import { useState, useEffect, useCallback } from 'react';

const BANCO_DE_PALAVRAS = [
  { palavra: "GATO", dica: "Animal doméstico" },
  { palavra: "BOLA", dica: "Usado em esportes" },
  { palavra: "REACT", dica: "Biblioteca JavaScript" },
  { palavra: "GEMINI", dica: "Modelo de IA do Google" },
  { palavra: "CODIGO", dica: "O que programadores escrevem" },
  { palavra: "NUVEM", dica: "Armazenamento remoto" },
  { palavra: "BRASIL", dica: "País da América do Sul" },
  { palavra: "TECLADO", dica: "Periférico de entrada" },
  { palavra: "MONITOR", dica: "A tela do computador" },
  { palavra: "PROGRAMACAO", dica: "A arte de criar software" },
  { palavra: "JAVASCRIPT", dica: "Linguagem da web" },
  { palavra: "FRAMEWORK", dica: "Estrutura para software" },
  { palavra: "COMPONENTE", dica: "Parte reutilizável de UI" },
  { palavra: "ALGORITMO", dica: "Sequência de passos lógicos" },
  { palavra: "DATABASE", dica: "Onde os dados são guardados" },
  { palavra: "FUNCAO", dica: "Bloco de código nomeado" },
  { palavra: "VARIAVEL", dica: "Armazena um valor na programação" },
  { palavra: "INTERNET", dica: "Rede mundial de computadores" },
  { palavra: "SMARTPHONE", dica: "Telefone inteligente" },
  { palavra: "CHOCOLATE", dica: "Doce feito de cacau" },
  { palavra: "BICICLETA", dica: "Veículo de duas rodas" },
  { palavra: "UNIVERSO", dica: "Tudo o que existe fisicamente" },
  { palavra: "FOTOGRAFIA", dica: "A arte de capturar imagens" },
  { palavra: "MUSICA", dica: "Arte de combinar sons" },
  { palavra: "OCEANO", dica: "Grande corpo de água salgada" },
  { palavra: "MONTANHA", dica: "Grande elevação natural da terra" },
  { palavra: "CEREBRO", dica: "Órgão principal do sistema nervoso" },
  { palavra: "ABACAXI", dica: "Fruta tropical com coroa" },
  { palavra: "PERNAMBUCO", dica: "Estado do Nordeste brasileiro" },
  { palavra: "RECIFE", dica: "Capital de Pernambuco" },
];

const DIFICULDADES = {
  FACIL: { nome: 'Fácil', erros: 8, minLetras: 3, maxLetras: 5 },
  MEDIO: { nome: 'Médio', erros: 6, minLetras: 6, maxLetras: 8 },
  DIFICIL: { nome: 'Difícil', erros: 4, minLetras: 9, maxLetras: 99 },
};

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function EstilosDeAnimacao() {
  return (
    <style jsx global>{`
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes popIn { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } }
      @keyframes shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
      @keyframes slideUpFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
  );
}

function DesenhoForca({ erros, jogoGanho, jogoPerdido }) {
  const estiloForca = { stroke: '#8B4513', strokeWidth: '8', strokeLinecap: 'round' };
  const estiloCorda = { stroke: '#A0522D', strokeWidth: '4', strokeLinecap: 'round' };
  const estiloBonecoPadrao = { stroke: '#34495e', strokeWidth: '4', strokeLinecap: 'round', fill: 'none' };
  const estiloCabecaPadrao = { fill: '#FFDDC1', stroke: '#34495e', strokeWidth: '2' };
  const corVitoria = '#2ecc71';
  const corDerrota = '#e74c3c';
  const estiloBonecoVencedor = { ...estiloBonecoPadrao, stroke: corVitoria };
  const estiloCabecaVencedor = { ...estiloCabecaPadrao, fill: corVitoria, stroke: 'white' };
  const estiloBonecoPerdedor = { ...estiloBonecoPadrao, stroke: corDerrota };
  const estiloCabecaPerdedor = { ...estiloCabecaPadrao, fill: corDerrota, stroke: 'white' };
  
  const EstruturaForca = () => ( <g> <line x1="30" y1="230" x2="170" y2="230" {...estiloForca} /> <line x1="60" y1="230" x2="60" y2="50" {...estiloForca} /> <line x1="56" y1="50" x2="144" y2="50" {...estiloForca} /> </g> );
  const PartesDoCorpo = ({ estiloCabeca, estiloBoneco }) => ([
    <g key="cabeca" className="parte-corpo"><circle cx="140" cy="90" r="20" {...estiloCabeca} /></g>, <line key="corpo" className="parte-corpo" x1="140" y1="110" x2="140" y2="160" {...estiloBoneco} />, <line key="braco-esquerdo" className="parte-corpo" x1="140" y1="125" x2="110" y2="140" {...estiloBoneco} />, <line key="braco-direito" className="parte-corpo" x1="140" y1="125" x2="170" y2="140" {...estiloBoneco} />, <line key="perna-esquerda" className="parte-corpo" x1="140" y1="158" x2="125" y2="190" {...estiloBoneco} />, <line key="perna-direita" className="parte-corpo" x1="140" y1="158" x2="155" y2="190" {...estiloBoneco} />,
  ]);
  
  const JogoAtivo = () => ( <> <EstruturaForca /> <line x1="140" y1="50" x2="140" y2="70" {...estiloCorda} /> {PartesDoCorpo({ estiloCabeca: estiloCabecaPadrao, estiloBoneco: estiloBonecoPadrao }).slice(0, erros)} </> );
  const StickVencedor = () => ( <g className="vencedor"> <circle cx="100" cy="150" r="20" {...estiloCabecaVencedor} /> <path d="M 92 153 Q 100 160 108 153" stroke="#fff" fill="none" strokeWidth="2" /> <line x1="100" y1="170" x2="100" y2="210" {...estiloBonecoVencedor} /> <line className="braco-vencedor" x1="100" y1="180" x2="70" y2="160" {...estiloBonecoVencedor} /> <line className="braco-vencedor" x1="100" y1="180" x2="130" y2="160" {...estiloBonecoVencedor} /> <line x1="100" y1="208" x2="85" y2="240" {...estiloBonecoVencedor} /> <line x1="100" y1="208" x2="115" y2="240" {...estiloBonecoVencedor} /> </g> );
  const StickPerdedor = () => ( <> <EstruturaForca /> <line x1="140" y1="50" x2="140" y2="70" {...estiloCorda} /> {PartesDoCorpo({ estiloCabeca: estiloCabecaPerdedor, estiloBoneco: estiloBonecoPerdedor })} <path d="M 132 100 Q 140 95 148 100" stroke="#fff" fill="none" strokeWidth="2" /> <path className="lagrima" d="M 130 95 C 130 95, 128 100, 132 102 C 136 100, 134 95, 134 95" fill="#3498db" /> <path className="lagrima lagrima2" d="M 145 95 C 145 95, 143 100, 147 102 C 151 100, 149 95, 149 95" fill="#3498db" /> </> );

  return (
    <svg height="250" width="200" style={{ margin: '20px 0' }} viewBox="0 0 200 250">
      <style jsx>{`
        .parte-corpo { animation: fadeIn 0.5s ease-in; } .vencedor { animation: cair-e-pular 1.5s ease-out forwards; } .braco-vencedor { animation: acenar 0.8s ease-in-out infinite alternate; animation-delay: 1.5s; } .lagrima { animation: chorando 2.5s linear infinite; opacity: 0; } .lagrima2 { animation-delay: 1.25s; }
        @keyframes cair-e-pular { 0% { transform: translate(40px, -60px); } 20% { transform: translate(0, 10px); } 40% { transform: translate(0, -10px); } 60% { transform: translate(0, 0); } 80% { transform: translateY(-30px); } 100% { transform: translateY(0); } }
        @keyframes acenar { from { transform: rotate(-20deg); transform-origin: 100px 180px; } to { transform: rotate(20deg); transform-origin: 100px 180px; } }
        @keyframes chorando { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: 1; transform: translateY(5px); } 100% { opacity: 0; transform: translateY(40px); } }
      `}</style>
      {jogoGanho ? <StickVencedor /> : jogoPerdido ? <StickPerdedor /> : <JogoAtivo />}
    </svg>
  );
}

function Teclado({ letrasAdivinhadas, jogoAcabou, onLetraClick, statusLetras }) {
  return (
    <div style={estilos.tecladoContainer}>
      <div style={estilos.teclado}>
        {ALFABETO.split('').map(letra => {
          const isDisabled = letrasAdivinhadas.has(letra) || jogoAcabou;
          const status = statusLetras[letra];
          const classes = ['botao-letra', isDisabled ? 'desabilitado' : '', status ? status : ''].join(' ');
          return (<button key={letra} className={classes} onClick={() => !isDisabled && onLetraClick(letra)} disabled={isDisabled} type="button" aria-label={`Letra ${letra}`}>{letra}</button>);
        })}
      </div>
      <style jsx>{`
        .botao-letra { min-width: 35px; height: 45px; width: 45px; font-size: 1.2rem; cursor: pointer; border: 2px solid white; border-radius: 4px; background-color: #34495e; color: white; transition: all 0.2s ease; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: bold; user-select: none; }
        .botao-letra:hover:not(.desabilitado) { background-color: #4a69bd; transform: scale(1.05); } .botao-letra:active:not(.desabilitado) { transform: scale(0.95); } .desabilitado { cursor: not-allowed; } .correta, .correta.desabilitado { background-color: #27ae60; border-color: #2ecc71; color: white; transform: scale(1.05); box-shadow: 0 0 8px #2ecc71; } .incorreta, .incorreta.desabilitado { background-color: #c0392b; border-color: #e74c3c; color: white; opacity: 0.8; }
      `}</style>
    </div>
  );
}

function MensagemFinal({ jogoGanho, palavra, onReiniciar, onMudarDificuldade, visivel }) {
  if (!visivel) return null;
  return (
    <div style={estilos.mensagemFinalContainer} className="container-animado">
      <p style={{ ...estilos.mensagemFinalTexto, animationDelay: '0.2s' }}>{jogoGanho ? '🎉 VOCÊ VENCEU! 🎉' : '💀 VOCÊ PERDEU! 💀'}</p>
      <p style={{ fontSize: '1.5rem', textAlign: 'center', animationDelay: '0.4s' }}>A palavra era: <strong>{palavra}</strong></p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', animationDelay: '0.6s' }}>
        <button style={estilos.botaoReiniciar} onClick={onReiniciar}>Jogar Novamente</button>
        <button style={estilos.botaoSecundario} onClick={onMudarDificuldade}>Mudar Dificuldade</button>
      </div>
      <style jsx>{`.container-animado > * { animation: slideUpFadeIn 0.5s ease-out forwards; opacity: 0; }`}</style>
    </div>
  );
}

export default function JogoDaForcaPersonalizado() {
  const [etapa, setEtapa] = useState('NOME');
  const [jogador, setJogador] = useState('');
  const [dificuldade, setDificuldade] = useState(null);
  const [palavra, setPalavra] = useState('');
  const [dica, setDica] = useState('');
  const [letrasAdivinhadas, setLetrasAdivinhadas] = useState(new Set());
  const [erros, setErros] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [statusLetras, setStatusLetras] = useState({});
  const maxErros = dificuldade ? DIFICULDADES[dificuldade].erros : 0;
  const iniciarJogo = useCallback((nivel) => { const config = DIFICULDADES[nivel]; const palavrasValidas = BANCO_DE_PALAVRAS.filter(p => p.palavra.length >= config.minLetras && p.palavra.length <= config.maxLetras); if (palavrasValidas.length === 0) { alert(`Nenhuma palavra encontrada para a dificuldade ${config.nome}.`); setEtapa('DIFICULDADE'); return; } const { palavra: novaPalavra, dica: novaDica } = palavrasValidas[Math.floor(Math.random() * palavrasValidas.length)]; setPalavra(novaPalavra); setDica(novaDica); setLetrasAdivinhadas(new Set()); setErros(0); setStatusLetras({}); }, []);
  const handleNomeSubmit = (nome) => { if (nome.trim()) { setJogador(nome.trim()); setEtapa('DIFICULDADE'); } }
  const handleDificuldadeSelect = (nivel) => { setDificuldade(nivel); iniciarJogo(nivel); setEtapa('JOGO'); }
  const handleMudarDificuldade = () => { setDificuldade(null); setEtapa('DIFICULDADE'); }
  const handleLetraClick = useCallback((letra) => { if (letrasAdivinhadas.has(letra)) return; const novasLetras = new Set(letrasAdivinhadas); novasLetras.add(letra); setLetrasAdivinhadas(novasLetras); if (palavra.includes(letra)) { setStatusLetras(prev => ({...prev, [letra]: 'correta'})); } else { setStatusLetras(prev => ({...prev, [letra]: 'incorreta'})); setErros((errosAtuais) => errosAtuais + 1); setIsShaking(true); setTimeout(() => setIsShaking(false), 500); } }, [letrasAdivinhadas, palavra]);
  const jogoGanho = palavra && palavra.split('').every(letra => letrasAdivinhadas.has(letra));
  const jogoPerdido = erros >= maxErros;
  const jogoAcabou = etapa === 'JOGO' && (jogoGanho || jogoPerdido);
  useEffect(() => { const handleKeyDown = (event) => { const letra = event.key.toUpperCase(); if (etapa === 'JOGO' && ALFABETO.includes(letra) && !jogoAcabou) { handleLetraClick(letra); } }; window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [handleLetraClick, etapa, jogoAcabou]);
  const estiloTelaNome = { ...estilos.tela, transform: etapa === 'NOME' ? 'translateX(0%)' : 'translateX(-100%)' };
  const estiloTelaDificuldade = { ...estilos.tela, transform: etapa === 'DIFICULDADE' ? 'translateX(0%)' : etapa === 'NOME' ? 'translateX(100%)' : 'translateX(-100%)' };
  const estiloTelaJogo = { ...estilos.tela, transform: etapa === 'JOGO' ? 'translateX(0%)' : 'translateX(100%)' };
  
  return (
    <div style={estilos.container}>
      <EstilosDeAnimacao />
      <div style={estilos.palco}>
        <div style={estiloTelaNome}><h1 style={{marginBottom: '30px'}}>Bem-vindo ao Jogo da Forca!</h1><form onSubmit={(e) => { e.preventDefault(); handleNomeSubmit(e.target.elements.nome.value); }}><label htmlFor="nome" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '10px' }}>Digite seu nome para começar:</label><input type="text" id="nome" name="nome" style={estilos.inputNome} required autoFocus /><button type="submit" style={estilos.botaoReiniciar}>Continuar</button></form></div>
        <div style={estiloTelaDificuldade}><h1 style={{marginBottom: '30px'}}>Jogo da Forca</h1><h2>Olá, {jogador}! Escolha um nível:</h2><div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>{Object.keys(DIFICULDADES).map(nivel => (<button key={nivel} style={estilos.botaoReiniciar} onClick={() => handleDificuldadeSelect(nivel)}>{DIFICULDADES[nivel].nome}</button>))}</div></div>
        <div style={estiloTelaJogo}>
          {dificuldade && <h1>Forca de {jogador} - Nível {DIFICULDADES[dificuldade].nome}</h1>}
          <div className={isShaking && !jogoAcabou ? 'shake' : ''} style={{ animation: isShaking && !jogoAcabou ? 'shake 0.5s' : 'none' }}><DesenhoForca erros={erros} jogoGanho={jogoGanho} jogoPerdido={jogoPerdido} /></div>
          <div style={{minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%'}}>
            {jogoAcabou ? (<MensagemFinal jogoGanho={jogoGanho} palavra={palavra} onReiniciar={() => iniciarJogo(dificuldade)} onMudarDificuldade={handleMudarDificuldade} visivel={jogoAcabou}/>) : (
              <div style={estilos.jogoAtivoContainer}>
                <p style={estilos.dica}>💡 Dica: {dica}</p>
                <div style={estilos.palavra}>{palavra.split('').map((letra, index) => (<span key={index} style={estilos.letraCaixa}>{letrasAdivinhadas.has(letra) ? (<span style={estilos.letraRevelada}>{letra}</span>) : null}</span>))}</div>
                <Teclado letrasAdivinhadas={letrasAdivinhadas} jogoAcabou={jogoAcabou} onLetraClick={handleLetraClick} statusLetras={statusLetras}/>
              </div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

const estilos = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#2c3e50', color: 'white', fontFamily: 'monospace', padding: '10px', boxSizing: 'border-box', overflowX: 'hidden' },
  palco: { position: 'relative', width: '100%', maxWidth: '100vw', height: '90vh', overflow: 'hidden' },
  tela: { position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.5s ease-in-out', padding: '10px', textAlign: 'center', boxSizing: 'border-box' },
  jogoAtivoContainer: { animation: 'fadeIn 0.5s ease-in-out', width: '100%' },
  palavra: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5em', fontSize: 'clamp(1.5rem, 8vw, 2.5rem)', margin: '20px 0', textAlign: 'center', minHeight: '60px', alignItems: 'center', wordBreak: 'break-all', width: '100%' },
  letraCaixa: { width: '1em', height: '1.2em', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderBottom: '4px solid white', color: 'white' },
  letraRevelada: { animation: 'popIn 0.3s ease-out' },
  dica: { fontSize: '1.2rem', color: '#bdc3c7', marginTop: '10px', textAlign: 'center' },
  tecladoContainer: { width: '100%', display: 'flex', justifyContent: 'center', margin: '20px 0', boxSizing: 'border-box' },
  teclado: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', width: '100%', maxWidth: '900px', margin: '0 auto' },
  mensagemFinalContainer: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  mensagemFinalTexto: { fontSize: '2rem', margin: '20px 0', textAlign: 'center' },
  botaoReiniciar: { padding: '15px 30px', fontSize: '1.2rem', cursor: 'pointer', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.05)' } },
  botaoSecundario: { padding: '15px 30px', fontSize: '1.2rem', cursor: 'pointer', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.05)' } },
  inputNome: { fontSize: '1.5rem', padding: '10px', borderRadius: '5px', border: '2px solid white', backgroundColor: 'transparent', color: 'white', textAlign: 'center', marginBottom: '20px', width: '90%', maxWidth: '400px' },
};