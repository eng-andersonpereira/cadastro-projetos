import { Grade, Kpi, KpiRotulo, KpiValor, KpiNota, Barra, Preenchimento, Selo } from './estilos.js'
import { Anel } from './Graficos.jsx'
import { dinheiro } from './utilidades.js'

// Os quatro cartões coloridos de resumo do mês.
// Este componente só MOSTRA números: recebe tudo pronto por props.
function Kpis({
  totalPostes,
  metaNum,
  qtdProjetos,
  totalValor,
  valorPoste,
  metaAcumulada,
  adiantado,
  falta,
  porDia,
  diasRestantes,
  mesPassado,
  noRitmo,
}) {
  // Estes três valores só são usados aqui, então são calculados aqui dentro.
  const pct = metaNum > 0 ? Math.round((totalPostes / metaNum) * 100) : 0
  const corSituacao =
    metaNum <= 0 ? '#94a3b8' : noRitmo ? '#16a34a' : '#dc2626'
  const situacao = mesPassado
    ? noRitmo
      ? 'META BATIDA'
      : 'META NÃO BATIDA'
    : noRitmo
      ? 'NO RITMO'
      : 'ATRASADO'

  return (
    <Grade>
      <Kpi $cor="#2563eb">
        <div style={{ flex: 1 }}>
          <KpiRotulo>Postes no mês</KpiRotulo>
          <KpiValor>{totalPostes}</KpiValor>
          <KpiNota>
            {metaNum > 0 ? `de ${metaNum} da meta` : 'defina a meta acima'} ·{' '}
            {qtdProjetos} projetos
          </KpiNota>
          {metaNum > 0 && (
            <Barra>
              <Preenchimento
                $cor="linear-gradient(90deg, #38bdf8, #2563eb)"
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </Barra>
          )}
        </div>
        {metaNum > 0 && <Anel percentual={pct} cor="#2563eb" />}
      </Kpi>

      <Kpi $cor="#16a34a" $atraso={80}>
        <div>
          <KpiRotulo>Valor no mês</KpiRotulo>
          <KpiValor>{dinheiro(totalValor)}</KpiValor>
          <KpiNota>
            {valorPoste > 0
              ? `${dinheiro(valorPoste)} por poste`
              : 'defina o valor por poste'}
          </KpiNota>
        </div>
      </Kpi>

      <Kpi $cor={corSituacao} $atraso={160}>
        <div>
          <KpiRotulo>Situação</KpiRotulo>
          <div style={{ margin: '8px 0' }}>
            <Selo $cor={corSituacao} style={{ fontSize: 15, padding: '5px 14px' }}>
              {metaNum > 0 ? situacao : 'SEM META'}
            </Selo>
          </div>
          <KpiNota>
            {metaNum > 0
              ? `Meta acumulada ${metaAcumulada} · ${
                  adiantado >= 0
                    ? `${adiantado} à frente`
                    : `${Math.abs(adiantado)} atrás`
                }`
              : 'informe a meta do mês'}
          </KpiNota>
        </div>
      </Kpi>

      <Kpi $cor="#f59e0b" $atraso={240}>
        <div>
          <KpiRotulo>Falta para a meta</KpiRotulo>
          <KpiValor>{metaNum > 0 ? falta : '-'}</KpiValor>
          <KpiNota>
            {metaNum > 0 && !mesPassado
              ? `Precisa de ${porDia}/dia · ${diasRestantes} dias restantes`
              : metaNum > 0
                ? 'mês encerrado'
                : 'informe a meta do mês'}
          </KpiNota>
        </div>
      </Kpi>
    </Grade>
  )
}

export default Kpis