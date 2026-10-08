export function lerNomeZip(nomeArquivo) {
  const nome = nomeArquivo.replace(/\.zip$/i, '')
  const achado = nome.match(/^(.+?)_RD_PROJETO_(\d+)_R\d+/i)

  if (!achado) return null

  return { ss: achado[1].trim(), nota: achado[2] }
}