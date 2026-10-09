// Funções de apoio usadas pelo App: formatar datas e dinheiro, montar a
// mensagem de entrega, validar a extensão e gerar os dados de demonstração.
import { diasDoMes } from './controle.js'

export function gerarMensagem(projeto) {
  const extensao = projeto.extensao.replace('.', ',')
  const licenca = projeto.licencaAmbiental ? 'SIM' : 'NAO'
  const postes = String(projeto.postes).padStart(2, '0')

  return `SS: ${projeto.ss}
NOTA: ${projeto.nota}
EXTENSÃO DE REDE: ${extensao}
LICENÇA AMBIENTAL: ${licenca}
POSTES ${postes}`
}

export function copiar(texto) {
  navigator.clipboard.writeText(texto)
  alert('Mensagem copiada! Agora é só colar no WhatsApp.')
}

export function interpretarDitado(texto) {
  const partes = texto.toLowerCase().split('nota')
  const ssTexto = partes[0] || ''
  const notaTexto = partes[1] || ''

  const ssNumeros = ssTexto.replace(/\D/g, '')
  const notaNumeros = notaTexto.replace(/\D/g, '')
  const reenvio = /\b(ex|x)\b/.test(ssTexto)

  return {
    ss: reenvio ? `${ssNumeros}-EX` : ssNumeros,
    nota: notaNumeros,
  }
}

export function hoje() {
  return new Date().toLocaleDateString('en-CA')
}

export function formatarData(data) {
  if (!data) return ''
  return data.split('-').reverse().join('/')
}

export function dinheiro(numero) {
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function extensaoValida(texto) {
  const numero = Number(String(texto).replace(',', '.'))

  if (Number.isNaN(numero) || numero <= 0) {
    alert('Extensão inválida. Exemplo: 0,193')
    return false
  }

  if (numero >= 10) {
    return window.confirm(
      `A extensão ${texto} km parece muito grande. Confirmar mesmo assim?`
    )
  }

  return true
}

export const mesAtual = hoje().slice(0, 7)

export function gerarDemonstracao() {
  const padrao = [20, 15, 24, 9, 31, 30, 18, 22, 12, 27, 16, 25, 14, 28]
  const diaAtual = new Date().getDate()
  const lista = []
  let contador = 0

  for (let dia = 1; dia <= diaAtual; dia++) {
    const total = padrao[(dia - 1) % padrao.length]
    const partes =
      total >= 18 ? [Math.ceil(total / 2), Math.floor(total / 2)] : [total]

    partes.forEach((postes) => {
      contador += 1
      lista.push({
        ss: `100000${String(contador).padStart(3, '0')}${
          contador % 5 === 0 ? '-EX' : ''
        }`,
        nota: `4301000${String(contador).padStart(2, '0')}`,
        status: 'finalizado',
        postes,
        extensao: `0,${200 + ((contador * 37) % 600)}`,
        licencaAmbiental: contador % 3 === 0,
        dataEntrega: `${mesAtual}-${String(dia).padStart(2, '0')}`,
        demo: true,
      })
    })
  }

  lista.push({ ss: '100000990', nota: '430100990', status: 'pendente', demo: true })
  lista.push({ ss: '100000991-EX', nota: '430100991', status: 'pendente', demo: true })

  const total = lista
    .filter((p) => p.status === 'finalizado')
    .reduce((soma, p) => soma + p.postes, 0)
  const meta = Math.round((total / diaAtual) * diasDoMes(mesAtual) * 0.8 / 10) * 10

  return { projetos: lista, meta: String(meta), valor: '10' }
}