import styled, { keyframes } from 'styled-components'

const crescer = keyframes`
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
`
const desenhar = keyframes`
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
`
const aparecer = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const Svg = styled.svg`
  width: 100%;
  height: auto;
  max-height: 300px;
  display: block;
  font-family: system-ui, sans-serif;
`
const Coluna = styled.rect`
  transform-box: fill-box;
  transform-origin: bottom;
  animation: ${crescer} 0.7s ease-out both;
`
const Tracado = styled.path`
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  animation: ${desenhar} 1.1s ease-out both;
`
const Area = styled.path`
  animation: ${aparecer} 1.2s ease-out both;
`
const Legenda = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;

  span::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 3px;
    margin-right: 6px;
    background: var(--cor);
    vertical-align: -1px;
  }
`
const Vazio = styled.p`
  color: #94a3b8;
  text-align: center;
  padding: 30px 0;
  margin: 0;
`

const MESES = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
]

function mesCurto(mes) {
  const [ano, numero] = mes.split('-')
  return `${MESES[Number(numero) - 1]}/${ano.slice(2)}`
}

function escala(maximo) {
  const max = Math.max(maximo, 1)
  const bruto = max / 4
  const potencia = Math.pow(10, Math.floor(Math.log10(bruto)))
  const fracao = bruto / potencia
  const bonito = fracao <= 1 ? 1 : fracao <= 2 ? 2 : fracao <= 5 ? 5 : 10
  const passo = bonito * potencia
  const topo = Math.ceil(max / passo) * passo
  return { passo, topo }
}

function rotulosDias(totalDias) {
  const lista = [1, 5, 10, 15, 20, 25, 30].filter((d) => d <= totalDias)
  if (totalDias - lista[lista.length - 1] >= 3) lista.push(totalDias)
  return lista
}

const LARGURA = 640
const ESQ = 46
const DIR = 18
const TOPO = 18
const BASE = 32

function Grade({ altura, topo, passo }) {
  const area = altura - TOPO - BASE
  const marcas = []
  for (let v = 0; v <= topo; v += passo) marcas.push(v)

  return marcas.map((v) => {
    const y = TOPO + (1 - v / topo) * area
    return (
      <g key={v}>
        <line
          x1={ESQ}
          x2={LARGURA - DIR}
          y1={y}
          y2={y}
          stroke={v === 0 ? '#cbd5e1' : '#e2e8f0'}
          strokeWidth="1"
        />
        <text x={ESQ - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
          {v}
        </text>
      </g>
    )
  })
}

export function Anel({ percentual, cor, tamanho = 84 }) {
  const raio = 34
  const circunferencia = 2 * Math.PI * raio
  const preenchido = Math.min(percentual, 100) / 100

  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 84 84" role="img">
      <title>{`${percentual}% da meta`}</title>
      <circle cx="42" cy="42" r={raio} fill="none" stroke="#e2e8f0" strokeWidth="9" />
      <circle
        cx="42"
        cy="42"
        r={raio}
        fill="none"
        stroke={cor}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${preenchido * circunferencia} ${circunferencia}`}
        transform="rotate(-90 42 42)"
        style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
      />
      <text
        x="42"
        y="47"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="#1e293b"
      >
        {percentual}%
      </text>
    </svg>
  )
}

export function GraficoAcumulado({ totalDias, meta, controle }) {
  if (controle.length === 0) return <Vazio>Sem dados neste mês.</Vazio>

  const altura = 280
  const area = altura - TOPO - BASE
  const largura = LARGURA - ESQ - DIR
  const ultimo = controle[controle.length - 1].acumulado
  const { passo, topo } = escala(Math.max(meta, ultimo))

  const x = (dia) => ESQ + ((dia - 1) / Math.max(totalDias - 1, 1)) * largura
  const y = (valor) => TOPO + (1 - valor / topo) * area

  const caminho = controle
    .map((l, i) => `${i === 0 ? 'M' : 'L'} ${x(l.dia)} ${y(l.acumulado)}`)
    .join(' ')
  const primeiro = controle[0]
  const final = controle[controle.length - 1]
  const caminhoArea = `${caminho} L ${x(final.dia)} ${y(0)} L ${x(primeiro.dia)} ${y(0)} Z`

  return (
    <div>
      <Svg viewBox={`0 0 ${LARGURA} ${altura}`} role="img">
        <title>Postes acumulados no mês comparados com a meta</title>
        <defs>
          <linearGradient id="gradAcumulado" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <Grade altura={altura} topo={topo} passo={passo} />

        {rotulosDias(totalDias).map((d) => (
          <text key={d} x={x(d)} y={altura - 10} textAnchor="middle" fontSize="11" fill="#94a3b8">
            {d}
          </text>
        ))}

        {meta > 0 && (
          <line
            x1={x(1)}
            y1={y(meta / totalDias)}
            x2={x(totalDias)}
            y2={y(meta)}
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray="7 5"
          />
        )}

        <Area d={caminhoArea} fill="url(#gradAcumulado)" />
        <Tracado d={caminho} pathLength="1" stroke="#16a34a" strokeWidth="3.5" />

        {controle.map((l) => (
          <circle
            key={l.dia}
            cx={x(l.dia)}
            cy={y(l.acumulado)}
            r={l.dia === final.dia ? 5.5 : 3.5}
            fill="#fff"
            stroke={l.noRitmo ? '#16a34a' : '#dc2626'}
            strokeWidth="2.5"
          >
            <title>{`Dia ${l.dia}: ${l.acumulado} postes (meta acumulada ${l.metaAcumulada})`}</title>
          </circle>
        ))}

        <text
          x={Math.min(x(final.dia), LARGURA - DIR - 4)}
          y={y(final.acumulado) - 12}
          textAnchor="end"
          fontSize="13"
          fontWeight="700"
          fill="#166534"
        >
          {final.acumulado}
        </text>
      </Svg>
      <Legenda>
        <span style={{ '--cor': '#16a34a' }}>Acumulado</span>
        {meta > 0 && <span style={{ '--cor': '#f59e0b' }}>Meta acumulada</span>}
      </Legenda>
    </div>
  )
}

export function GraficoDiario({ totalDias, meta, controle }) {
  if (controle.length === 0) return <Vazio>Sem dados neste mês.</Vazio>

  const altura = 260
  const area = altura - TOPO - BASE
  const largura = LARGURA - ESQ - DIR
  const media = meta > 0 ? meta / totalDias : 0
  const maior = Math.max(...controle.map((l) => l.producao), media)
  const { passo, topo } = escala(maior)

  const passoX = largura / totalDias
  const larguraBarra = Math.min(passoX * 0.68, 26)
  const y = (valor) => TOPO + (1 - valor / topo) * area

  return (
    <div>
      <Svg viewBox={`0 0 ${LARGURA} ${altura}`} role="img">
        <title>Postes entregues por dia</title>
        <defs>
          <linearGradient id="gradVerde" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="gradAzul" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        <Grade altura={altura} topo={topo} passo={passo} />

        {rotulosDias(totalDias).map((d) => (
          <text
            key={d}
            x={ESQ + (d - 0.5) * passoX}
            y={altura - 10}
            textAnchor="middle"
            fontSize="11"
            fill="#94a3b8"
          >
            {d}
          </text>
        ))}

        {controle.map((l, i) => {
          const cx = ESQ + (l.dia - 0.5) * passoX
          const acima = media > 0 && l.producao >= media
          const topoBarra = y(l.producao)

          return (
            <g key={l.dia}>
              <Coluna
                x={cx - larguraBarra / 2}
                y={topoBarra}
                width={larguraBarra}
                height={Math.max(y(0) - topoBarra, l.producao > 0 ? 2 : 0)}
                rx="4"
                fill={acima ? 'url(#gradVerde)' : 'url(#gradAzul)'}
                style={{ animationDelay: `${i * 35}ms` }}
              >
                <title>{`Dia ${l.dia}: ${l.producao} postes`}</title>
              </Coluna>
              {l.producao > 0 ? (
                <text x={cx} y={topoBarra - 5} textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">
                  {l.producao}
                </text>
              ) : (
                <circle cx={cx} cy={y(0) - 3} r="2.5" fill="#dc2626">
                  <title>{`Dia ${l.dia}: sem entrega`}</title>
                </circle>
              )}
            </g>
          )
        })}

        {media > 0 && (
          <line
            x1={ESQ}
            x2={LARGURA - DIR}
            y1={y(media)}
            y2={y(media)}
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="7 5"
          />
        )}
      </Svg>
      <Legenda>
        <span style={{ '--cor': '#22c55e' }}>Dia acima da média necessária</span>
        <span style={{ '--cor': '#3b82f6' }}>Dia abaixo</span>
        {media > 0 && (
          <span style={{ '--cor': '#f59e0b' }}>
            Média necessária ({media.toFixed(1).replace('.', ',')}/dia)
          </span>
        )}
      </Legenda>
    </div>
  )
}

export function GraficoMeses({ historico }) {
  const meses = historico.slice(0, 12).reverse()

  if (meses.length === 0) return <Vazio>Sem dados ainda.</Vazio>

  const altura = 240
  const area = altura - TOPO - BASE
  const largura = LARGURA - ESQ - DIR
  const maior = Math.max(...meses.map((m) => Math.max(m.postes, m.meta)), 1)
  const { passo, topo } = escala(maior)

  const slots = Math.max(meses.length, 4)
  const passoX = largura / slots
  const larguraBarra = Math.min(passoX * 0.55, 56)
  const y = (valor) => TOPO + (1 - valor / topo) * area

  return (
    <div>
      <Svg viewBox={`0 0 ${LARGURA} ${altura}`} role="img">
        <title>Postes por mês comparados com a meta</title>
        <defs>
          <linearGradient id="gradMes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        <Grade altura={altura} topo={topo} passo={passo} />

        {meses.map((m, i) => {
          const cx = ESQ + (i + 0.5) * passoX
          const topoBarra = y(m.postes)

          return (
            <g key={m.mes}>
              <Coluna
                x={cx - larguraBarra / 2}
                y={topoBarra}
                width={larguraBarra}
                height={Math.max(y(0) - topoBarra, m.postes > 0 ? 2 : 0)}
                rx="6"
                fill="url(#gradMes)"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <title>{`${mesCurto(m.mes)}: ${m.postes} postes (meta ${m.meta || '-'})`}</title>
              </Coluna>
              <text x={cx} y={topoBarra - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">
                {m.postes}
              </text>
              {m.meta > 0 && (
                <line
                  x1={cx - larguraBarra / 2 - 6}
                  x2={cx + larguraBarra / 2 + 6}
                  y1={y(m.meta)}
                  y2={y(m.meta)}
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
              <text x={cx} y={altura - 10} textAnchor="middle" fontSize="11" fill="#64748b">
                {mesCurto(m.mes)}
              </text>
            </g>
          )
        })}
      </Svg>
      <Legenda>
        <span style={{ '--cor': '#2563eb' }}>Postes no mês</span>
        <span style={{ '--cor': '#f59e0b' }}>Meta do mês</span>
      </Legenda>
    </div>
  )
}