function acharData(texto) {
  const achados = [...texto.matchAll(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/g)]
  if (achados.length === 0) return ''

  const [, dia, mes, anoTexto] = achados[achados.length - 1]
  const ano = anoTexto.length === 2 ? `20${anoTexto}` : anoTexto

  if (Number(mes) < 1 || Number(mes) > 12) return ''
  if (Number(dia) < 1 || Number(dia) > 31) return ''

  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
}

export function lerMensagens(texto, dataPadrao) {
  const regra =
    /SS:\s*(\S+)\s*NOTA:\s*(\d+)\s*EXTENS[ÃA]O DE REDE:\s*([\d.,]+)\s*LICEN[ÇC]A AMBIENTAL:\s*(SIM|N[ÃA]O)\s*POSTES\s*(\d+)/gi

  const lidas = []
  let fimAnterior = 0
  let achado

  while ((achado = regra.exec(texto)) !== null) {
    const antes = texto.slice(fimAnterior, achado.index)

    lidas.push({
      ss: achado[1].replace(/,$/, ''),
      nota: achado[2],
      extensao: achado[3],
      licencaAmbiental: /^SIM$/i.test(achado[4]),
      postes: Number(achado[5]),
      dataEntrega: acharData(antes) || dataPadrao || '',
    })

    fimAnterior = regra.lastIndex
  }

  return lidas
}