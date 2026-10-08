import styled, { keyframes, css } from 'styled-components'

const pular = keyframes`
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-13px) rotate(3deg); }
`
const balancar = keyframes`
  0%, 100% { transform: translateY(5px) rotate(-1.5deg); }
  50% { transform: translateY(5px) rotate(1.5deg); }
`
const respirar = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`
const bracoEsq = keyframes`
  0%, 100% { transform: rotate(155deg); }
  50% { transform: rotate(100deg); }
`
const bracoDir = keyframes`
  0%, 100% { transform: rotate(-100deg); }
  50% { transform: rotate(-155deg); }
`
const bracoEsqTriste = keyframes`
  0%, 100% { transform: rotate(5deg); }
  50% { transform: rotate(11deg); }
`
const bracoDirTriste = keyframes`
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(-11deg); }
`
const acenar = keyframes`
  0%, 100% { transform: rotate(-150deg); }
  50% { transform: rotate(-118deg); }
`
const pernaEsq = keyframes`
  0%, 100% { transform: rotate(10deg); }
  50% { transform: rotate(-12deg); }
`
const pernaDir = keyframes`
  0%, 100% { transform: rotate(-12deg); }
  50% { transform: rotate(10deg); }
`
const cabecaFeliz = keyframes`
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
`
const cabecaTriste = keyframes`
  0%, 100% { transform: translateY(3px) rotate(9deg); }
  50% { transform: translateY(4px) rotate(5deg); }
`
const subirNota = keyframes`
  0% { opacity: 0; transform: translate(0, 0) scale(0.7); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translate(0, -60px) scale(1.1); }
`
const brilhar = keyframes`
  0%, 100% { opacity: 0.15; transform: scale(0.6); }
  50% { opacity: 1; transform: scale(1.15); }
`
const chover = keyframes`
  0% { opacity: 0; transform: translateY(0); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translateY(50px); }
`
const lagrima = keyframes`
  0% { opacity: 0; transform: translateY(0); }
  25% { opacity: 1; }
  100% { opacity: 0; transform: translateY(28px); }
`
const sombra = keyframes`
  0%, 100% { transform: scaleX(1); opacity: 0.2; }
  50% { transform: scaleX(0.78); opacity: 0.12; }
`
const derivar = keyframes`
  0%, 100% { transform: translateX(-6px); }
  50% { transform: translateX(6px); }
`

const dancando = css`
  .corpo {
    transform-origin: 100px 205px;
    animation: ${pular} 0.55s ease-in-out infinite;
  }
  .cabeca {
    transform-origin: 100px 94px;
    animation: ${cabecaFeliz} 1.1s ease-in-out infinite;
  }
  .bracoE {
    transform-origin: 75px 106px;
    animation: ${bracoEsq} 1.1s ease-in-out infinite;
  }
  .bracoD {
    transform-origin: 125px 106px;
    animation: ${bracoDir} 1.1s ease-in-out infinite;
  }
  .pernaE {
    transform-origin: 88px 146px;
    animation: ${pernaEsq} 1.1s ease-in-out infinite;
  }
  .pernaD {
    transform-origin: 112px 146px;
    animation: ${pernaDir} 1.1s ease-in-out infinite;
  }
  .sombra {
    transform-origin: 100px 211px;
    animation: ${sombra} 0.55s ease-in-out infinite;
  }
  .nota {
    animation: ${subirNota} 2.2s ease-out infinite;
  }
  .brilho {
    transform-box: fill-box;
    transform-origin: center;
    animation: ${brilhar} 1.2s ease-in-out infinite;
  }
`

const triste = css`
  .corpo {
    transform-origin: 100px 205px;
    animation: ${balancar} 3s ease-in-out infinite;
  }
  .cabeca {
    transform-origin: 100px 94px;
    animation: ${cabecaTriste} 3s ease-in-out infinite;
  }
  .bracoE {
    transform-origin: 75px 106px;
    animation: ${bracoEsqTriste} 3s ease-in-out infinite;
  }
  .bracoD {
    transform-origin: 125px 106px;
    animation: ${bracoDirTriste} 3s ease-in-out infinite;
  }
  .sombra {
    transform-origin: 100px 211px;
  }
  .nuvem {
    animation: ${derivar} 4s ease-in-out infinite;
  }
  .gota {
    animation: ${chover} 1.1s linear infinite;
  }
  .lagrima {
    animation: ${lagrima} 2s ease-in infinite;
  }
`

const neutro = css`
  .corpo {
    transform-origin: 100px 205px;
    animation: ${respirar} 3s ease-in-out infinite;
  }
  .bracoD {
    transform-origin: 125px 106px;
    animation: ${acenar} 1.2s ease-in-out infinite;
  }
`

const Cena = styled.svg`
  width: ${(p) => p.$tamanho}px;
  max-width: 100%;
  height: auto;
  overflow: visible;
  display: block;

  ${(p) => (p.$humor === 'feliz' ? dancando : p.$humor === 'triste' ? triste : neutro)}

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
    }
  }
`

const PELE = '#f5c9a0'
const ESCURO = '#1e293b'

function Estrela({ x, y, atraso }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        className="brilho"
        style={{ animationDelay: `${atraso}s` }}
        d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4 Z"
        fill="#fde047"
      />
    </g>
  )
}

function Rosto({ humor }) {
  if (humor === 'feliz') {
    return (
      <g>
        <path d="M85 76 Q90 69 95 76" fill="none" stroke={ESCURO} strokeWidth="3" strokeLinecap="round" />
        <path d="M105 76 Q110 69 115 76" fill="none" stroke={ESCURO} strokeWidth="3" strokeLinecap="round" />
        <path d="M89 82 Q100 97 111 82 Z" fill="#7f1d1d" />
        <ellipse cx="100" cy="88.5" rx="5" ry="2.8" fill="#fb7185" />
        <circle cx="81" cy="83" r="4.2" fill="#fb7185" opacity="0.55" />
        <circle cx="119" cy="83" r="4.2" fill="#fb7185" opacity="0.55" />
      </g>
    )
  }

  if (humor === 'triste') {
    return (
      <g>
        <circle cx="90" cy="76" r="3.2" fill={ESCURO} />
        <circle cx="110" cy="76" r="3.2" fill={ESCURO} />
        <circle cx="91" cy="75" r="1" fill="#fff" />
        <circle cx="111" cy="75" r="1" fill="#fff" />
        <path d="M91 88 Q100 80 109 88" fill="none" stroke={ESCURO} strokeWidth="3" strokeLinecap="round" />
        <path
          className="lagrima"
          d="M113 79 Q108.5 86 113 89 Q117.5 86 113 79 Z"
          fill="#60a5fa"
        />
      </g>
    )
  }

  return (
    <g>
      <circle cx="90" cy="76" r="3.2" fill={ESCURO} />
      <circle cx="110" cy="76" r="3.2" fill={ESCURO} />
      <circle cx="91" cy="75" r="1" fill="#fff" />
      <circle cx="111" cy="75" r="1" fill="#fff" />
      <path d="M92 84 Q100 90 108 84" fill="none" stroke={ESCURO} strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

export default function Mascote({ humor = 'neutro', tamanho = 150 }) {
  const descricao =
    humor === 'feliz'
      ? 'Trabalhador dançando feliz: você está no ritmo'
      : humor === 'triste'
        ? 'Trabalhador triste: você está atrasado na meta'
        : 'Trabalhador acenando: defina a meta do mês'

  return (
    <Cena viewBox="0 0 200 225" $humor={humor} $tamanho={tamanho} role="img" aria-label={descricao}>
      <title>{descricao}</title>

      {humor === 'triste' && (
        <g>
          {[72, 88, 112, 128].map((x, i) => (
            <line
              key={x}
              className="gota"
              style={{ animationDelay: `${i * 0.27}s` }}
              x1={x}
              y1="40"
              x2={x - 3}
              y2="52"
              stroke="#e0f2fe"
              strokeWidth="4"
              strokeLinecap="round"
            />
          ))}
          <g className="nuvem">
            <circle cx="80" cy="24" r="12" fill="#94a3b8" />
            <circle cx="99" cy="16" r="16" fill="#94a3b8" />
            <circle cx="120" cy="23" r="13" fill="#94a3b8" />
            <rect x="68" y="22" width="64" height="15" rx="7.5" fill="#94a3b8" />
            <rect x="72" y="30" width="56" height="7" rx="3.5" fill="#64748b" opacity="0.55" />
          </g>
        </g>
      )}

      {humor === 'feliz' && (
        <g>
          <text className="nota" x="152" y="92" fontSize="26" fill="#fde047" style={{ animationDelay: '0s' }}>
            ♪
          </text>
          <text className="nota" x="30" y="104" fontSize="26" fill="#fde047" style={{ animationDelay: '0.7s' }}>
            ♫
          </text>
          <text className="nota" x="162" y="130" fontSize="22" fill="#fff" style={{ animationDelay: '1.4s' }}>
            ♪
          </text>
          <Estrela x={160} y={46} atraso={0} />
          <Estrela x={36} y={52} atraso={0.4} />
          <Estrela x={176} y={150} atraso={0.8} />
          <Estrela x={22} y={142} atraso={0.2} />
        </g>
      )}

      <ellipse className="sombra" cx="100" cy="211" rx="44" ry="7" fill="#0f172a" opacity="0.2" />

      <g className="corpo">
        <g className="pernaE">
          <rect x="81" y="142" width="14" height="52" rx="6" fill="#1e3a8a" />
          <rect x="75" y="188" width="26" height="14" rx="6" fill="#3f2d1d" />
        </g>
        <g className="pernaD">
          <rect x="105" y="142" width="14" height="52" rx="6" fill="#1e3a8a" />
          <rect x="99" y="188" width="26" height="14" rx="6" fill="#3f2d1d" />
        </g>

        <rect x="71" y="96" width="58" height="54" rx="14" fill="#f97316" />
        <rect x="71" y="114" width="58" height="6" fill="#e2e8f0" opacity="0.95" />
        <rect x="71" y="127" width="58" height="6" fill="#e2e8f0" opacity="0.95" />
        <rect x="71" y="141" width="58" height="9" fill="#78350f" />
        <rect x="95" y="142" width="10" height="7" rx="1.5" fill="#fbbf24" />

        <g className="bracoE">
          <path d="M76 106 L68 142" stroke="#2563eb" strokeWidth="13" strokeLinecap="round" fill="none" />
          <circle cx="67" cy="147" r="7.5" fill={PELE} />
        </g>
        <g className="bracoD">
          <path d="M124 106 L132 142" stroke="#2563eb" strokeWidth="13" strokeLinecap="round" fill="none" />
          <circle cx="133" cy="147" r="7.5" fill={PELE} />
        </g>

        <g className="cabeca">
          <rect x="93" y="88" width="14" height="12" rx="4" fill={PELE} />
          <circle cx="76" cy="72" r="4.5" fill={PELE} />
          <circle cx="124" cy="72" r="4.5" fill={PELE} />
          <circle cx="100" cy="68" r="24" fill={PELE} />
          <Rosto humor={humor} />
          <path d="M75 62 Q75 34 100 34 Q125 34 125 62 Z" fill="#facc15" />
          <rect x="95" y="34" width="10" height="28" fill="#fde047" />
          <rect x="68" y="59" width="64" height="8" rx="4" fill="#eab308" />
        </g>
      </g>
    </Cena>
  )
}