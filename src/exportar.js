function celula(valor) {
  const texto = String(valor ?? '')
  return `"${texto.replace(/"/g, '""')}"`
}

function dataBR(data) {
  return data ? data.split('-').reverse().join('/') : ''
}

function dinheiro(numero) {
  return numero.toFixed(2).replace('.', ',')
}

function baixarCsv(nomeArquivo, tabela) {
  const texto = tabela
    .map((linha) => linha.map(celula).join(';'))
    .join('\r\n')

  const arquivo = new Blob(['\uFEFF' + texto], {
    type: 'text/csv;charset=utf-8;',
  })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(arquivo)
  link.download = nomeArquivo
  link.click()
  URL.revokeObjectURL(link.href)
}

export function baixarExcel(projetos, mes) {
  const doMes = projetos
    .filter(
      (p) =>
        p.status === 'finalizado' &&
        p.dataEntrega &&
        p.dataEntrega.startsWith(mes)
    )
    .sort((a, b) => a.dataEntrega.localeCompare(b.dataEntrega))

  const cabecalho = [
    'Data de entrega',
    'SS',
    'Nota',
    'Postes',
    'Extensão (km)',
    'Licença ambiental',
  ]

  const linhas = doMes.map((p) => [
    dataBR(p.dataEntrega),
    p.ss,
    p.nota,
    p.postes,
    p.extensao,
    p.licencaAmbiental ? 'SIM' : 'NAO',
  ])

  const total = doMes.reduce((soma, p) => soma + p.postes, 0)
  linhas.push(['TOTAL', '', '', total, '', ''])

  baixarCsv(`projetos-${mes}.csv`, [cabecalho, ...linhas])
}

export function baixarControle(controle, mes) {
  const cabecalho = [
    'Data',
    'Produção do dia',
    'Acumulado',
    'Meta acumulada',
    'Situação',
    'Valor do dia (R$)',
    'Valor acumulado (R$)',
  ]

  const linhas = controle.map((l) => [
    dataBR(l.data),
    l.producao,
    l.acumulado,
    l.metaAcumulada,
    l.noRitmo ? 'NO RITMO' : 'ATRASADO',
    dinheiro(l.valorDia),
    dinheiro(l.valorAcumulado),
  ])

  baixarCsv(`controle-${mes}.csv`, [cabecalho, ...linhas])
}