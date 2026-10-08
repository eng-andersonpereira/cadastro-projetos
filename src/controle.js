export function diasDoMes(mes) {
  const [ano, numero] = mes.split('-').map(Number)
  return new Date(ano, numero, 0).getDate()
}

export function montarControle(finalizados, mes, meta, valorPoste, diaReferencia) {
  const totalDias = diasDoMes(mes)
  const metaNum = Number(meta) || 0
  const valorNum = Number(valorPoste) || 0
  let acumulado = 0
  const linhas = []

  for (let dia = 1; dia <= diaReferencia; dia++) {
    const data = `${mes}-${String(dia).padStart(2, '0')}`

    const producao = finalizados
      .filter((p) => p.dataEntrega === data)
      .reduce((soma, p) => soma + p.postes, 0)

    acumulado += producao

    const metaAcumulada = Math.ceil((metaNum * dia) / totalDias)

    linhas.push({
      dia,
      data,
      producao,
      acumulado,
      metaAcumulada,
      noRitmo: acumulado >= metaAcumulada,
      valorDia: producao * valorNum,
      valorAcumulado: acumulado * valorNum,
    })
  }

  return linhas
}