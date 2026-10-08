import { useState, useEffect } from 'react'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { baixarExcel, baixarControle } from './exportar.js'
import { montarControle, diasDoMes } from './controle.js'
import { lerNomeZip } from './zips.js'
import { lerMensagens } from './mensagens.js'
import Mascote from './Mascote.jsx'
import {
  Anel,
  GraficoAcumulado,
  GraficoDiario,
  GraficoMeses,
} from './Graficos.jsx'

const subir = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const Global = createGlobalStyle`
  * { box-sizing: border-box; }
  body {
    margin: 0 !important;
    display: block !important;
    background: #eef2f7 !important;
    color: #1e293b !important;
  }
  #root {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    border: none !important;
    text-align: left !important;
    display: block !important;
    min-height: 100vh;
  }
`

const Topo = styled.header`
  background: linear-gradient(120deg, #1e3a8a 0%, #2563eb 55%, #0d9488 100%);
  color: #fff;
  padding: 26px 0 30px;
  margin-bottom: 20px;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 8px 24px rgba(30, 58, 138, 0.25);
`
const Centro = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
`
const TituloTopo = styled.h1`
  margin: 0 !important;
  font-size: 30px !important;
  line-height: 1.2 !important;
  color: #fff !important;
  letter-spacing: -0.5px;
`
const Subtitulo = styled.p`
  margin: 4px 0 18px;
  color: #bfdbfe;
  font-size: 15px;
`
const Controles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`
const Rotulo = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #dbeafe;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`
const CampoTopo = styled.input`
  padding: 9px 10px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 15px;
  width: 170px;
  color-scheme: dark;

  &::placeholder {
    color: #bfdbfe;
  }
  &:focus {
    outline: 2px solid #fff;
  }
`

const TopoLinha = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px 28px;
`
const Palco = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  margin-bottom: -6px;
`
const Balao = styled.div`
  position: relative;
  background: #fff;
  color: #1e293b;
  border-radius: 16px;
  padding: 11px 15px;
  max-width: 230px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.25);
  margin-bottom: 70px;

  &::after {
    content: '';
    position: absolute;
    right: -9px;
    bottom: 14px;
    border: 9px solid transparent;
    border-left-color: #fff;
    border-right: 0;
  }
`
const Abas = styled.div`
  display: inline-flex;
  gap: 4px;
  background: #e2e8f0;
  padding: 4px;
  border-radius: 12px;
`
const Aba = styled.button`
  border: none;
  padding: 8px 14px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: ${(p) => (p.$ativo ? '#fff' : 'transparent')};
  color: ${(p) => (p.$ativo ? '#1d4ed8' : '#64748b')};
  box-shadow: ${(p) => (p.$ativo ? '0 1px 4px rgba(15, 23, 42, 0.15)' : 'none')};
  transition: all 0.15s;

  &:hover {
    color: #1d4ed8;
  }
`
const BarraLista = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 6px 0 14px;
`
const GrupoCabeca = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 18px 4px 8px;
  font-weight: 700;
  color: #334155;
`
const GrupoCaixa = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.07);
`
const Registro = styled.article`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 6px 12px;
  padding: 12px 14px 12px 12px;
  border-left: 5px solid ${(p) => p.$cor};
  border-bottom: 1px solid #eef2f7;
  transition: background 0.12s;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f8fafc;
  }
`
const Principal = styled.div`
  min-width: 0;
`
const LinhaTitulo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 16px;
`
const Detalhe = styled.div`
  margin-top: 3px;
  font-size: 13px;
  color: #64748b;
`
const Acoes = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`
const Icone = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid ${(p) => (p.$perigo ? '#fecaca' : p.$verde ? '#bbf7d0' : '#e2e8f0')};
  background: ${(p) => (p.$perigo ? '#fff5f5' : p.$verde ? '#f0fdf4' : '#f8fafc')};
  font-size: 17px;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;

  &:hover {
    transform: translateY(-2px) scale(1.06);
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
  }
`
const Expandido = styled.div`
  grid-column: 1 / -1;
`

const Usuario = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #dbeafe;
  font-size: 14px;

  strong {
    color: #fff;
  }
  button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    opacity: 0.8;
  }
  button:hover {
    opacity: 1;
  }
`
const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  border: 2px solid rgba(255, 255, 255, 0.8);
`

const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, ${(p) => p.$min || 230}px), 1fr)
  );
  gap: 14px;
  margin-bottom: 16px;
`
const Kpi = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.07);
  border-top: 5px solid ${(p) => p.$cor};
  animation: ${subir} 0.5s ease-out both;
  animation-delay: ${(p) => p.$atraso || 0}ms;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`
const KpiRotulo = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`
const KpiValor = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.15;
  margin: 2px 0;
`
const KpiNota = styled.div`
  font-size: 13px;
  color: #64748b;
`
const Barra = styled.div`
  height: 8px;
  background: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 8px;
`
const Preenchimento = styled.div`
  height: 100%;
  border-radius: 8px;
  background: ${(p) => p.$cor};
  transition: width 0.8s ease-out;
`

const Cartao = styled.section`
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.07);
  animation: ${subir} 0.5s ease-out both;
`
const Secao = styled.h2`
  margin: 0 0 12px !important;
  font-size: 18px !important;
  line-height: 1.3 !important;
  color: #0f172a !important;
  letter-spacing: 0 !important;
`
const SubSecao = styled.h3`
  margin: 14px 0 8px !important;
  font-size: 15px !important;
  color: #1e3a8a !important;
`
const Linha = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 8px 0;
`
const Campo = styled.input`
  padding: 9px 11px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #fff;
  color: #0f172a;
  font-size: 14px;

  &:focus {
    outline: 3px solid #bfdbfe;
    border-color: #3b82f6;
  }
`
const AreaTexto = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;

  &:focus {
    outline: 3px solid #bfdbfe;
    border-color: #3b82f6;
  }
`
const Botao = styled.button`
  padding: 9px 14px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s, background 0.12s;
  background: #f1f5f9;
  color: #334155;

  &:hover {
    background: #e2e8f0;
    transform: translateY(-1px);
  }

  ${(p) =>
    p.$ativo &&
    `
    background: #2563eb;
    border-color: #2563eb;
    color: #fff;
    &:hover { background: #1d4ed8; }
  `}

  ${(p) =>
    p.$tipo === 'primario' &&
    `
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
    &:hover { background: linear-gradient(135deg, #3b82f6, #2563eb); }
  `}

  ${(p) =>
    p.$tipo === 'sucesso' &&
    `
    background: linear-gradient(135deg, #16a34a, #15803d);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
    &:hover { background: linear-gradient(135deg, #22c55e, #16a34a); }
  `}

  ${(p) =>
    p.$tipo === 'perigo' &&
    `
    background: #fff;
    border-color: #fecaca;
    color: #dc2626;
    &:hover { background: #fef2f2; }
  `}
`
const Selo = styled.span`
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: ${(p) => p.$cor};
`
const Chip = styled.span`
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 13px;
  background: #f1f5f9;
  color: #475569;
`
const Mensagem = styled.pre`
  background: #0f172a;
  color: #e2e8f0;
  padding: 12px 14px;
  border-radius: 12px;
  margin: 8px 0;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
`
const Rolagem = styled.div`
  overflow-x: auto;
`
const Tabela = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: 14px;

  th,
  td {
    padding: 8px 10px;
    text-align: center;
    border-bottom: 1px solid #e2e8f0;
  }
  th {
    background: #f1f5f9;
    color: #475569;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  tbody tr:nth-child(even) {
    background: #f8fafc;
  }
  tbody tr:hover {
    background: #eff6ff;
  }
`
const Soltar = styled.div`
  border: 2px dashed ${(p) => (p.$ativo ? '#2563eb' : '#cbd5e1')};
  background: ${(p) => (p.$ativo ? '#eff6ff' : '#f8fafc')};
  border-radius: 14px;
  padding: 14px;
  margin-top: 10px;
  transition: all 0.15s;
`
const Aviso = styled.div`
  background: ${(p) => (p.$ok ? '#ecfdf5' : '#fef2f2')};
  border: 1px solid ${(p) => (p.$ok ? '#16a34a' : '#fca5a5')};
  color: ${(p) => (p.$ok ? '#166534' : '#991b1b')};
  border-radius: 12px;
  padding: 11px 14px;
  margin-bottom: 16px;
  font-weight: 600;
`
const ItemProjeto = styled.article`
  background: #fff;
  border-radius: 14px;
  border-left: 6px solid ${(p) => p.$cor};
  padding: 12px 14px;
  margin-bottom: 10px;
  box-shadow: 0 1px 6px rgba(15, 23, 42, 0.07);
  animation: ${subir} 0.4s ease-out both;
`
const Detalhes = styled.details`
  background: #fff;
  border-radius: 16px;
  padding: 14px 18px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.07);

  summary {
    cursor: pointer;
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
  }
  &[open] summary {
    margin-bottom: 12px;
  }
`

function gerarMensagem(projeto) {
  const extensao = projeto.extensao.replace('.', ',')
  const licenca = projeto.licencaAmbiental ? 'SIM' : 'NAO'
  const postes = String(projeto.postes).padStart(2, '0')

  return `SS: ${projeto.ss}
NOTA: ${projeto.nota}
EXTENSÃO DE REDE: ${extensao}
LICENÇA AMBIENTAL: ${licenca}
POSTES ${postes}`
}

function copiar(texto) {
  navigator.clipboard.writeText(texto)
  alert('Mensagem copiada! Agora é só colar no WhatsApp.')
}

function interpretarDitado(texto) {
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

function hoje() {
  return new Date().toLocaleDateString('en-CA')
}

function formatarData(data) {
  if (!data) return ''
  return data.split('-').reverse().join('/')
}

function dinheiro(numero) {
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function extensaoValida(texto) {
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

const mesAtual = hoje().slice(0, 7)

function App() {
  const [ss, setSs] = useState('')
  const [nota, setNota] = useState('')

  const [projetos, setProjetos] = useState(() => {
    const salvo = localStorage.getItem('projetos')
    return salvo ? JSON.parse(salvo) : []
  })

  const [notaEmBaixa, setNotaEmBaixa] = useState(null)
  const [postes, setPostes] = useState('')
  const [extensao, setExtensao] = useState('')
  const [licenca, setLicenca] = useState(false)
  const [dataEntrega, setDataEntrega] = useState(hoje())

  const [edicao, setEdicao] = useState(null)
  const [notaComMensagem, setNotaComMensagem] = useState(null)
  const [busca, setBusca] = useState('')
  const [aba, setAba] = useState('todos')
  const [mesSel, setMesSel] = useState(mesAtual)
  const [avisoZip, setAvisoZip] = useState('')
  const [arrastando, setArrastando] = useState(false)
  const [textoImport, setTextoImport] = useState('')
  const [dataImport, setDataImport] = useState('')
  const [dataLote, setDataLote] = useState(hoje())
  const [usuario, setUsuario] = useState(
    () => localStorage.getItem('usuario') || 'Anderson'
  )
  const [textoBackup, setTextoBackup] = useState('')
  const [ultimoBackup, setUltimoBackup] = useState(
    () => localStorage.getItem('ultimoBackup') || ''
  )

  useEffect(() => {
    localStorage.setItem('projetos', JSON.stringify(projetos))
  }, [projetos])

  const [metas, setMetas] = useState(() => {
    const salvo = localStorage.getItem('metas')
    if (salvo) return JSON.parse(salvo)

    return {
      [mesAtual]: {
        meta: localStorage.getItem(`meta-${mesAtual}`) || '',
        valor: localStorage.getItem(`valor-${mesAtual}`) || '',
      },
    }
  })

  useEffect(() => {
    localStorage.setItem('metas', JSON.stringify(metas))
  }, [metas])

  useEffect(() => {
    localStorage.setItem('usuario', usuario)
  }, [usuario])

  function trocarNome() {
    const novo = window.prompt('Qual é o seu nome?', usuario)
    if (novo && novo.trim() !== '') setUsuario(novo.trim())
  }

  function mudarMeta(campo, valor) {
    setMetas({ ...metas, [mesSel]: { ...metas[mesSel], [campo]: valor } })
  }

  function ditar() {
    const Reconhecimento =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!Reconhecimento) {
      alert('Este navegador não suporta ditado. Use o Chrome.')
      return
    }

    const reconhecimento = new Reconhecimento()
    reconhecimento.lang = 'pt-BR'

    reconhecimento.onresult = (evento) => {
      const texto = evento.results[0][0].transcript
      const resultado = interpretarDitado(texto)
      setSs(resultado.ss)
      setNota(resultado.nota)
    }

    reconhecimento.onerror = () => alert('Não consegui ouvir. Tente de novo.')

    reconhecimento.start()
  }

  function processarZips(arquivos) {
    if (arquivos.length === 0) return

    const lidos = arquivos.map((a) => lerNomeZip(a.name)).filter(Boolean)

    if (lidos.length === 0) {
      setAvisoZip(
        `✖ Não reconheci o nome "${arquivos[0].name}". Esperado: SS_RD_PROJETO_NOTA_R00.zip`
      )
      return
    }

    if (lidos.length === 1) {
      setSs(lidos[0].ss)
      setNota(lidos[0].nota)
      setAvisoZip(
        `✔ Lido: SS ${lidos[0].ss} | Nota ${lidos[0].nota}. Já está preenchido acima, confira e clique em Cadastrar.`
      )
      return
    }

    const notasExistentes = new Set(projetos.map((p) => p.nota))
    const novos = []

    lidos.forEach((l) => {
      if (notasExistentes.has(l.nota)) return
      notasExistentes.add(l.nota)
      novos.push({ ss: l.ss, nota: l.nota, status: 'pendente' })
    })

    if (novos.length === 0) {
      setAvisoZip('✔ Todos esses projetos já estão cadastrados.')
      return
    }

    const confirmou = window.confirm(
      `Cadastrar ${novos.length} projetos novos como pendentes? (${
        lidos.length - novos.length
      } já existiam ou estavam repetidos)`
    )

    if (confirmou) {
      setProjetos([...projetos, ...novos])
      setAvisoZip(`✔ ${novos.length} projetos cadastrados como pendentes.`)
    }
  }

  function lerZips(e) {
    const arquivos = Array.from(e.target.files)
    e.target.value = ''
    processarZips(arquivos)
  }

  function soltarZips(e) {
    e.preventDefault()
    setArrastando(false)
    processarZips(Array.from(e.dataTransfer.files))
  }

  function importarMensagens() {
    const lidas = lerMensagens(textoImport, dataImport)

    if (lidas.length === 0) {
      alert('Não encontrei mensagens de entrega no texto colado.')
      return
    }

    const semData = lidas.filter((l) => l.dataEntrega === '')

    if (semData.length > 0) {
      alert(
        `${semData.length} mensagem(ns) sem data. Escolha a "Data padrão" acima do botão.`
      )
      return
    }

    const suspeitas = lidas.filter(
      (l) =>
        l.postes <= 0 ||
        Number(l.extensao.replace(',', '.')) >= 10 ||
        Number.isNaN(Number(l.extensao.replace(',', '.')))
    )

    if (suspeitas.length > 0) {
      alert(
        `Confira estas mensagens antes de importar: ${suspeitas
          .map((l) => l.nota)
          .join(', ')}`
      )
      return
    }

    const porNota = new Map(projetos.map((p) => [p.nota, p]))
    const notasNovas = new Set()
    const novos = []
    const finalizar = new Map()

    lidas.forEach((l) => {
      const dadosFinais = {
        status: 'finalizado',
        postes: l.postes,
        extensao: l.extensao,
        licencaAmbiental: l.licencaAmbiental,
        dataEntrega: l.dataEntrega,
      }
      const existente = porNota.get(l.nota)

      if (!existente) {
        if (notasNovas.has(l.nota)) return
        notasNovas.add(l.nota)
        novos.push({ ss: l.ss, nota: l.nota, ...dadosFinais })
      } else if (existente.status === 'pendente') {
        finalizar.set(l.nota, dadosFinais)
      }
    })

    const ignoradas = lidas.length - novos.length - finalizar.size

    if (novos.length === 0 && finalizar.size === 0) {
      alert(`As ${lidas.length} mensagens já estão cadastradas e finalizadas.`)
      return
    }

    const confirmou = window.confirm(
      `Importar ${novos.length} projetos novos e finalizar ${finalizar.size} que estavam pendentes? (${ignoradas} já estavam finalizados e serão ignorados)`
    )

    if (!confirmou) return

    const atualizados = projetos.map((p) =>
      finalizar.has(p.nota) ? { ...p, ...finalizar.get(p.nota) } : p
    )

    setProjetos([...atualizados, ...novos])
    setTextoImport('')
  }

  function cadastrar() {
    const ssLimpo = ss.trim()
    const notaLimpa = nota.trim()

    if (ssLimpo === '' || notaLimpa === '') {
      alert('Preencha o SS e a Nota')
      return
    }

    const jaExiste = projetos.some((projeto) => projeto.nota === notaLimpa)

    if (jaExiste) {
      alert('Essa Nota já está cadastrada')
      return
    }

    const novoProjeto = { ss: ssLimpo, nota: notaLimpa, status: 'pendente' }

    setProjetos([...projetos, novoProjeto])
    setSs('')
    setNota('')
  }

  function remover(projeto) {
    const confirmou = window.confirm(
      `Remover o projeto ${projeto.ss} (Nota ${projeto.nota})?`
    )
    if (!confirmou) return

    setProjetos(projetos.filter((p) => p.nota !== projeto.nota))
  }

  function abrirBaixa(notaDoProjeto) {
    setNotaEmBaixa(notaDoProjeto)
    setPostes('')
    setExtensao('')
    setLicenca(false)
    setDataEntrega(hoje())
    setEdicao(null)
  }

  function confirmarBaixa() {
    if (postes === '' || extensao.trim() === '' || dataEntrega === '') {
      alert('Preencha os postes, a extensão e a data de entrega')
      return
    }

    if (Number(postes) <= 0) {
      alert('Quantidade de postes inválida')
      return
    }

    if (!extensaoValida(extensao)) return

    const projetoAtual = projetos.find((p) => p.nota === notaEmBaixa)

    const projetoFinalizado = {
      ...projetoAtual,
      status: 'finalizado',
      postes: Number(postes),
      extensao: extensao.trim(),
      licencaAmbiental: licenca,
      dataEntrega,
    }

    setProjetos(
      projetos.map((p) => (p.nota === notaEmBaixa ? projetoFinalizado : p))
    )
    setNotaEmBaixa(null)
    copiar(gerarMensagem(projetoFinalizado))
  }

  function abrirEdicao(projeto) {
    setEdicao({
      notaOriginal: projeto.nota,
      status: projeto.status,
      ss: projeto.ss,
      nota: projeto.nota,
      postes: projeto.postes === undefined ? '' : String(projeto.postes),
      extensao: projeto.extensao || '',
      licencaAmbiental: projeto.licencaAmbiental || false,
      dataEntrega: projeto.dataEntrega || '',
    })
    setNotaEmBaixa(null)
  }

  function mudarEdicao(campo, valor) {
    setEdicao({ ...edicao, [campo]: valor })
  }

  function salvarEdicao() {
    const novoSs = edicao.ss.trim()
    const novaNota = edicao.nota.trim()

    if (novoSs === '' || novaNota === '') {
      alert('Preencha o SS e a Nota')
      return
    }

    const notaRepetida = projetos.some(
      (p) => p.nota === novaNota && p.nota !== edicao.notaOriginal
    )

    if (notaRepetida) {
      alert('Essa Nota já está cadastrada em outro projeto')
      return
    }

    if (edicao.status === 'finalizado') {
      if (edicao.postes === '' || Number(edicao.postes) <= 0) {
        alert('Quantidade de postes inválida')
        return
      }
      if (edicao.dataEntrega === '') {
        alert('Preencha a data de entrega')
        return
      }
      if (!extensaoValida(edicao.extensao)) return
    }

    const novaLista = projetos.map((projeto) => {
      if (projeto.nota !== edicao.notaOriginal) return projeto

      if (projeto.status === 'finalizado') {
        return {
          ...projeto,
          ss: novoSs,
          nota: novaNota,
          postes: Number(edicao.postes),
          extensao: edicao.extensao.trim(),
          licencaAmbiental: edicao.licencaAmbiental,
          dataEntrega: edicao.dataEntrega,
        }
      }

      return { ...projeto, ss: novoSs, nota: novaNota }
    })

    setProjetos(novaLista)
    setEdicao(null)
  }

  function dadosDoBackup() {
    return { versao: 2, usuario, projetos, metas }
  }

  function registrarBackup() {
    localStorage.setItem('ultimoBackup', hoje())
    setUltimoBackup(hoje())
  }

  function baixarBackup() {
    const texto = JSON.stringify(dadosDoBackup(), null, 2)
    const arquivo = new Blob([texto], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(arquivo)
    link.download = `backup-projetos-${hoje()}.json`
    link.click()
    URL.revokeObjectURL(link.href)
    registrarBackup()
  }

  function copiarBackupTexto() {
    navigator.clipboard.writeText(JSON.stringify(dadosDoBackup()))
    registrarBackup()
    alert(
      'Backup copiado como texto! Cole em uma mensagem (WhatsApp ou e-mail) e envie para o seu outro aparelho.'
    )
  }

  function compartilharBackup() {
    navigator
      .share({
        title: 'Backup do Cadastro de Projetos',
        text: JSON.stringify(dadosDoBackup()),
      })
      .then(registrarBackup)
      .catch(() => {})
  }

  function aplicarBackup(texto) {
    try {
      const dados = JSON.parse(texto)
      const lista = Array.isArray(dados) ? dados : dados.projetos
      if (!Array.isArray(lista)) throw new Error('formato inválido')

      const confirmou = window.confirm(
        `Restaurar ${lista.length} projetos? Isso substitui a lista atual.`
      )
      if (!confirmou) return false

      setProjetos(lista)
      if (!Array.isArray(dados)) {
        if (dados.metas) setMetas(dados.metas)
        if (dados.usuario) setUsuario(dados.usuario)
      }
      return true
    } catch {
      alert('Backup inválido. Confira se copiou o texto inteiro.')
      return false
    }
  }

  function restaurarBackup(e) {
    const arquivo = e.target.files[0]
    if (!arquivo) return

    const leitor = new FileReader()
    leitor.onload = () => aplicarBackup(leitor.result)
    leitor.readAsText(arquivo)
    e.target.value = ''
  }

  const metaDoMes = metas[mesSel]?.meta || ''
  const valorDoMes = metas[mesSel]?.valor || ''

  const finalizadosDoMes = projetos.filter(
    (p) =>
      p.status === 'finalizado' &&
      p.dataEntrega &&
      p.dataEntrega.startsWith(mesSel)
  )

  const totalPostes = finalizadosDoMes.reduce((soma, p) => soma + p.postes, 0)
  const metaNum = Number(metaDoMes)
  const totalValor = totalPostes * Number(valorDoMes)

  const totalDias = diasDoMes(mesSel)
  const mesPassado = mesSel < mesAtual
  const mesFuturo = mesSel > mesAtual
  const diaRef = mesPassado
    ? totalDias
    : mesFuturo
      ? 0
      : new Date().getDate()

  const metaAcumulada = Math.ceil((metaNum * diaRef) / totalDias)
  const falta = Math.max(metaNum - totalPostes, 0)
  const diasRestantes = totalDias - diaRef
  const porDia = diasRestantes > 0 ? Math.ceil(falta / diasRestantes) : falta
  const noRitmo = totalPostes >= metaAcumulada
  const situacao = mesPassado
    ? noRitmo
      ? 'META BATIDA'
      : 'META NÃO BATIDA'
    : noRitmo
      ? 'NO RITMO'
      : 'ATRASADO'

  const controle = montarControle(
    finalizadosDoMes,
    mesSel,
    metaDoMes,
    valorDoMes,
    diaRef
  )

  const mesesComDados = [
    ...new Set([
      ...projetos
        .filter((p) => p.status === 'finalizado' && p.dataEntrega)
        .map((p) => p.dataEntrega.slice(0, 7)),
      ...Object.keys(metas),
      mesAtual,
    ]),
  ]
    .sort()
    .reverse()

  const historico = mesesComDados.map((m) => {
    const doMes = projetos.filter(
      (p) =>
        p.status === 'finalizado' && p.dataEntrega && p.dataEntrega.startsWith(m)
    )
    const postesMes = doMes.reduce((soma, p) => soma + p.postes, 0)
    const metaMes = Number(metas[m]?.meta) || 0
    const valorMes = Number(metas[m]?.valor) || 0

    return {
      mes: m,
      qtdProjetos: doMes.length,
      postes: postesMes,
      meta: metaMes,
      valor: postesMes * valorMes,
    }
  })

  const entregasDoDia = projetos.filter(
    (p) => p.status === 'finalizado' && p.dataEntrega === dataLote
  )
  const textoLote = entregasDoDia.map(gerarMensagem).join('\n\n')

  const diasSemBackup = ultimoBackup
    ? Math.floor((new Date(hoje()) - new Date(ultimoBackup)) / 86400000)
    : null
  const precisaBackup =
    projetos.length > 0 && (diasSemBackup === null || diasSemBackup >= 1)

  const termo = busca.trim().toLowerCase()
  const qtdPendentes = projetos.filter((p) => p.status === 'pendente').length
  const qtdFinalizados = projetos.length - qtdPendentes

  const projetosFiltrados = [...projetos]
    .reverse()
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'pendente' ? -1 : 1
      if (a.status === 'finalizado') {
        return (b.dataEntrega || '').localeCompare(a.dataEntrega || '')
      }
      return 0
    })
    .filter((p) => aba === 'todos' || p.status === aba)
    .filter((p) => p.ss.toLowerCase().includes(termo) || p.nota.includes(termo))

  const adiantado = totalPostes - metaAcumulada
  const pct = metaNum > 0 ? Math.round((totalPostes / metaNum) * 100) : 0
  const corSituacao = noRitmo ? '#16a34a' : '#dc2626'

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'
  const primeiroNome = usuario.trim().split(' ')[0]
  const inicial = primeiroNome.charAt(0).toUpperCase()

  const humor = metaNum <= 0 ? 'neutro' : noRitmo ? 'feliz' : 'triste'
  const falaMascote =
    humor === 'neutro'
      ? `Defina a meta do mês, ${primeiroNome}, para eu começar a dançar! 👷`
      : humor === 'feliz'
        ? mesPassado
          ? 'Meta batida! Que mês! 🎉'
          : adiantado > 0
            ? `No ritmo, ${primeiroNome}! ${adiantado} postes à frente da meta. Bora! 💃`
            : 'No ritmo! Segue assim! 💃'
        : mesPassado
          ? 'Esse mês ficou abaixo da meta. No próximo a gente recupera! 💪'
          : `Calma, ${primeiroNome}. Atrasado ${Math.abs(adiantado)} postes, mas dá pra recuperar com ${porDia} por dia! 💪`

  const grupos = []
  projetosFiltrados.forEach((p) => {
    const chave =
      p.status === 'pendente' ? 'pendente' : p.dataEntrega || 'sem-data'
    let atual = grupos[grupos.length - 1]
    if (!atual || atual.chave !== chave) {
      atual = { chave, itens: [] }
      grupos.push(atual)
    }
    atual.itens.push(p)
  })

  return (
    <>
      <Global />

      <Topo>
        <Centro>
          <TopoLinha>
            <div>
          <Usuario>
            <Avatar>{inicial}</Avatar>
            <span>
              {saudacao}, <strong>{usuario}</strong>!
            </span>
            <button title="Trocar nome" aria-label="Trocar nome" onClick={trocarNome}>
              ✏️
            </button>
          </Usuario>
          <TituloTopo>⚡ Cadastro de Projetos</TituloTopo>
          <Subtitulo>Controle de produção · rede rural</Subtitulo>
          <Controles>
            <Rotulo>
              Mês
              <CampoTopo
                type="month"
                value={mesSel}
                onChange={(e) => e.target.value && setMesSel(e.target.value)}
              />
            </Rotulo>
            <Rotulo>
              Meta do mês (postes)
              <CampoTopo
                type="number"
                placeholder="Ex: 500"
                value={metaDoMes}
                onChange={(e) => mudarMeta('meta', e.target.value)}
              />
            </Rotulo>
            <Rotulo>
              Valor por poste (R$)
              <CampoTopo
                type="number"
                step="0.01"
                placeholder="Ex: 6"
                value={valorDoMes}
                onChange={(e) => mudarMeta('valor', e.target.value)}
              />
            </Rotulo>
          </Controles>
            </div>
            <Palco>
              <Balao>{falaMascote}</Balao>
              <Mascote humor={humor} tamanho={150} />
            </Palco>
          </TopoLinha>
        </Centro>
      </Topo>

      <Centro>
        {precisaBackup && (
          <Aviso>
            ⚠{' '}
            {diasSemBackup === null
              ? 'Você ainda não baixou nenhum backup.'
              : `Último backup há ${diasSemBackup} dia(s).`}{' '}
            Baixe um agora no cartão Backup, lá embaixo.
          </Aviso>
        )}

        <Grade>
          <Kpi $cor="#2563eb">
            <div style={{ flex: 1 }}>
              <KpiRotulo>Postes no mês</KpiRotulo>
              <KpiValor>{totalPostes}</KpiValor>
              <KpiNota>
                {metaNum > 0 ? `de ${metaNum} da meta` : 'defina a meta acima'} ·{' '}
                {finalizadosDoMes.length} projetos
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
                {Number(valorDoMes) > 0
                  ? `${dinheiro(Number(valorDoMes))} por poste`
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

        <Grade $min={420}>
          <Cartao>
            <Secao>📈 Evolução no mês</Secao>
            <GraficoAcumulado
              totalDias={totalDias}
              meta={metaNum}
              controle={controle}
            />
          </Cartao>
          <Cartao>
            <Secao>📊 Produção por dia</Secao>
            <GraficoDiario
              totalDias={totalDias}
              meta={metaNum}
              controle={controle}
            />
          </Cartao>
        </Grade>

        <Grade $min={400}>
          <Cartao>
            <Secao>➕ Novo projeto</Secao>
            <Linha>
              <Campo
                placeholder="Digite o SS"
                value={ss}
                onChange={(e) => setSs(e.target.value)}
              />
              <Campo
                placeholder="Digite a Nota"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
              />
              <Botao $tipo="primario" onClick={cadastrar}>
                Cadastrar
              </Botao>
              <Botao onClick={ditar}>🎤 Ditar</Botao>
            </Linha>
            <Soltar
              $ativo={arrastando}
              onDragOver={(e) => {
                e.preventDefault()
                setArrastando(true)
              }}
              onDragLeave={() => setArrastando(false)}
              onDrop={soltarZips}
            >
              <div>📦 Arraste o(s) zip(s) para cá ou escolha:</div>
              <Linha>
                <input type="file" accept=".zip" multiple onChange={lerZips} />
              </Linha>
              {avisoZip !== '' && <p style={{ margin: 0 }}>{avisoZip}</p>}
            </Soltar>
          </Cartao>

          <Cartao>
            <Secao>📨 Mensagens de entrega do dia</Secao>
            <Linha>
              <label>
                Data:{' '}
                <Campo
                  type="date"
                  value={dataLote}
                  onChange={(e) => setDataLote(e.target.value)}
                />
              </label>
              <Chip>{entregasDoDia.length} finalizado(s)</Chip>
              <Botao
                $tipo="sucesso"
                onClick={() => {
                  if (entregasDoDia.length === 0) {
                    alert('Nenhum projeto finalizado nesta data.')
                    return
                  }
                  copiar(textoLote)
                }}
              >
                Copiar todas
              </Botao>
            </Linha>
            {entregasDoDia.length > 0 && <Mensagem>{textoLote}</Mensagem>}
          </Cartao>
        </Grade>

        <Secao style={{ marginTop: 8 }}>📋 Projetos ({projetos.length})</Secao>

        <BarraLista>
          <Abas>
            <Aba $ativo={aba === 'todos'} onClick={() => setAba('todos')}>
              Todos ({projetos.length})
            </Aba>
            <Aba $ativo={aba === 'pendente'} onClick={() => setAba('pendente')}>
              Pendentes ({qtdPendentes})
            </Aba>
            <Aba
              $ativo={aba === 'finalizado'}
              onClick={() => setAba('finalizado')}
            >
              Finalizados ({qtdFinalizados})
            </Aba>
          </Abas>
          <Linha style={{ margin: 0 }}>
            <Campo
              placeholder="🔍 Buscar por SS ou Nota"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ minWidth: 230 }}
            />
            {busca !== '' && <Botao onClick={() => setBusca('')}>Limpar</Botao>}
          </Linha>
        </BarraLista>

        {projetosFiltrados.length === 0 && <p>Nenhum projeto encontrado.</p>}

        {grupos.map((grupo) => {
          const somaPostes = grupo.itens.reduce(
            (soma, p) => soma + (p.postes || 0),
            0
          )

          return (
            <div key={grupo.chave}>
              <GrupoCabeca>
                <span>
                  {grupo.chave === 'pendente'
                    ? `⏳ Pendentes · ${grupo.itens.length}`
                    : grupo.chave === 'sem-data'
                      ? `📅 Sem data · ${grupo.itens.length}`
                      : `📅 ${formatarData(grupo.chave)} · ${
                          grupo.itens.length
                        } projeto(s) · ${somaPostes} postes`}
                </span>
                {grupo.chave !== 'pendente' && grupo.chave !== 'sem-data' && (
                  <Botao
                    $tipo="sucesso"
                    onClick={() =>
                      copiar(grupo.itens.map(gerarMensagem).join('\n\n'))
                    }
                  >
                    📋 Copiar mensagens do dia
                  </Botao>
                )}
              </GrupoCabeca>

              <GrupoCaixa>
                {grupo.itens.map((projeto) => {
                  const finalizado = projeto.status === 'finalizado'

                  return (
                    <Registro
                      key={projeto.nota}
                      $cor={finalizado ? '#16a34a' : '#f59e0b'}
                    >
                      <Principal>
                        <LinhaTitulo>
                          <strong>SS {projeto.ss}</strong>
                          {projeto.ss.toLowerCase().endsWith('-ex') && (
                            <Selo $cor="#7c3aed">REENVIO</Selo>
                          )}
                          {!finalizado && <Selo $cor="#f59e0b">PENDENTE</Selo>}
                        </LinhaTitulo>
                        <Detalhe>
                          Nota {projeto.nota}
                          {finalizado &&
                            ` · ${projeto.postes} postes · ${projeto.extensao} km · licença ${
                              projeto.licencaAmbiental ? 'SIM' : 'NAO'
                            }`}
                        </Detalhe>
                      </Principal>

                      <Acoes>
                        {!finalizado && (
                          <Botao
                            $tipo="primario"
                            onClick={() => abrirBaixa(projeto.nota)}
                          >
                            ✔ Dar baixa
                          </Botao>
                        )}
                        {finalizado && (
                          <Icone
                            $verde
                            title="Copiar mensagem"
                            aria-label="Copiar mensagem"
                            onClick={() => copiar(gerarMensagem(projeto))}
                          >
                            📋
                          </Icone>
                        )}
                        {finalizado && (
                          <Icone
                            title="Ver mensagem"
                            aria-label="Ver mensagem"
                            onClick={() =>
                              setNotaComMensagem(
                                notaComMensagem === projeto.nota
                                  ? null
                                  : projeto.nota
                              )
                            }
                          >
                            👁
                          </Icone>
                        )}
                        <Icone
                          title="Editar"
                          aria-label="Editar"
                          onClick={() => abrirEdicao(projeto)}
                        >
                          ✏️
                        </Icone>
                        <Icone
                          $perigo
                          title="Remover"
                          aria-label="Remover"
                          onClick={() => remover(projeto)}
                        >
                          🗑
                        </Icone>
                      </Acoes>

                      {finalizado && notaComMensagem === projeto.nota && (
                        <Expandido>
                          <Mensagem>{gerarMensagem(projeto)}</Mensagem>
                        </Expandido>
                      )}

                      {notaEmBaixa === projeto.nota && (
                        <Expandido>
                          <SubSecao>Dar baixa</SubSecao>
                          <Linha>
                            <Campo
                              type="number"
                              placeholder="Postes"
                              value={postes}
                              onChange={(e) => setPostes(e.target.value)}
                            />
                            <Campo
                              placeholder="Extensão em km (ex: 0,193)"
                              value={extensao}
                              onChange={(e) => setExtensao(e.target.value)}
                            />
                            <label>
                              <input
                                type="checkbox"
                                checked={licenca}
                                onChange={(e) => setLicenca(e.target.checked)}
                              />{' '}
                              Licença ambiental
                            </label>
                            <label>
                              Data de entrega:{' '}
                              <Campo
                                type="date"
                                value={dataEntrega}
                                onChange={(e) => setDataEntrega(e.target.value)}
                              />
                            </label>
                          </Linha>
                          <Linha>
                            <Botao $tipo="primario" onClick={confirmarBaixa}>
                              Confirmar baixa
                            </Botao>
                            <Botao onClick={() => setNotaEmBaixa(null)}>
                              Cancelar
                            </Botao>
                          </Linha>
                        </Expandido>
                      )}

                      {edicao && edicao.notaOriginal === projeto.nota && (
                        <Expandido>
                          <SubSecao>Editar projeto</SubSecao>
                          <Linha>
                            <Campo
                              placeholder="SS"
                              value={edicao.ss}
                              onChange={(e) => mudarEdicao('ss', e.target.value)}
                            />
                            <Campo
                              placeholder="Nota"
                              value={edicao.nota}
                              onChange={(e) =>
                                mudarEdicao('nota', e.target.value)
                              }
                            />
                          </Linha>

                          {edicao.status === 'finalizado' && (
                            <Linha>
                              <Campo
                                type="number"
                                placeholder="Postes"
                                value={edicao.postes}
                                onChange={(e) =>
                                  mudarEdicao('postes', e.target.value)
                                }
                              />
                              <Campo
                                placeholder="Extensão em km (ex: 0,193)"
                                value={edicao.extensao}
                                onChange={(e) =>
                                  mudarEdicao('extensao', e.target.value)
                                }
                              />
                              <label>
                                <input
                                  type="checkbox"
                                  checked={edicao.licencaAmbiental}
                                  onChange={(e) =>
                                    mudarEdicao(
                                      'licencaAmbiental',
                                      e.target.checked
                                    )
                                  }
                                />{' '}
                                Licença ambiental
                              </label>
                              <label>
                                Data de entrega:{' '}
                                <Campo
                                  type="date"
                                  value={edicao.dataEntrega}
                                  onChange={(e) =>
                                    mudarEdicao('dataEntrega', e.target.value)
                                  }
                                />
                              </label>
                            </Linha>
                          )}

                          <Linha>
                            <Botao $tipo="primario" onClick={salvarEdicao}>
                              Salvar
                            </Botao>
                            <Botao onClick={() => setEdicao(null)}>
                              Cancelar
                            </Botao>
                          </Linha>
                        </Expandido>
                      )}
                    </Registro>
                  )
                })}
              </GrupoCaixa>
            </div>
          )
        })}

        <Detalhes open style={{ marginTop: 16 }}>
          <summary>🗓️ Controle diário (tabela)</summary>
          {controle.length === 0 ? (
            <p>Sem dias para mostrar neste mês.</p>
          ) : (
            <Rolagem>
              <Tabela>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Produção</th>
                    <th>Acumulado</th>
                    <th>Meta acum.</th>
                    <th>Situação</th>
                    <th>Valor do dia</th>
                    <th>Valor acum.</th>
                  </tr>
                </thead>
                <tbody>
                  {controle.map((l) => (
                    <tr key={l.data}>
                      <td>{formatarData(l.data)}</td>
                      <td>
                        <strong>{l.producao}</strong>
                      </td>
                      <td>{l.acumulado}</td>
                      <td>{l.metaAcumulada}</td>
                      <td>
                        <Selo $cor={l.noRitmo ? '#16a34a' : '#dc2626'}>
                          {l.noRitmo ? 'NO RITMO' : 'ATRASADO'}
                        </Selo>
                      </td>
                      <td>{dinheiro(l.valorDia)}</td>
                      <td>{dinheiro(l.valorAcumulado)}</td>
                    </tr>
                  ))}
                </tbody>
              </Tabela>
            </Rolagem>
          )}
          <Linha>
            <Botao onClick={() => baixarControle(controle, mesSel)}>
              ⬇ Controle do mês (Excel)
            </Botao>
            <Botao onClick={() => baixarExcel(projetos, mesSel)}>
              ⬇ Projetos do mês (Excel)
            </Botao>
          </Linha>
        </Detalhes>

        <Detalhes open>
          <summary>📅 Histórico por mês</summary>
          <GraficoMeses historico={historico} />
          <Rolagem>
            <Tabela style={{ marginTop: 12 }}>
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Projetos</th>
                  <th>Postes</th>
                  <th>Meta</th>
                  <th>%</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {historico.map((h) => (
                  <tr key={h.mes}>
                    <td>{h.mes}</td>
                    <td>{h.qtdProjetos}</td>
                    <td>
                      <strong>{h.postes}</strong>
                    </td>
                    <td>{h.meta || '-'}</td>
                    <td>
                      {h.meta > 0
                        ? `${Math.round((h.postes / h.meta) * 100)}%`
                        : '-'}
                    </td>
                    <td>{dinheiro(h.valor)}</td>
                    <td>
                      <Botao
                        $ativo={h.mes === mesSel}
                        onClick={() => setMesSel(h.mes)}
                      >
                        Ver
                      </Botao>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Tabela>
          </Rolagem>
        </Detalhes>

        <Detalhes>
          <summary>📥 Importar mensagens de entrega antigas</summary>
          <p>
            Cole uma ou várias mensagens no formato de entrega. Se vierem do
            WhatsApp com data, o app usa a data de cada uma.
          </p>
          <AreaTexto
            placeholder={
              'SS: 123456789\nNOTA: 430100000\nEXTENSÃO DE REDE: 0,540\nLICENÇA AMBIENTAL: NAO\nPOSTES 10'
            }
            value={textoImport}
            onChange={(e) => setTextoImport(e.target.value)}
          />
          <Linha>
            <label>
              Data padrão (para mensagens sem data):{' '}
              <Campo
                type="date"
                value={dataImport}
                onChange={(e) => setDataImport(e.target.value)}
              />
            </label>
            <Botao $tipo="primario" onClick={importarMensagens}>
              Importar mensagens
            </Botao>
          </Linha>
        </Detalhes>

        <Cartao>
          <Secao>💾 Backup</Secao>
          <p style={{ margin: '0 0 8px' }}>
            {ultimoBackup === ''
              ? 'Nenhum backup baixado ainda.'
              : `Último backup: ${formatarData(ultimoBackup)}${
                  diasSemBackup === 0 ? ' (hoje ✔)' : ''
                }`}
          </p>
          <Linha>
            <Botao $tipo="primario" onClick={baixarBackup}>
              Baixar backup
            </Botao>
            <Botao onClick={copiarBackupTexto}>Copiar backup (texto)</Botao>
            {typeof navigator !== 'undefined' && navigator.share && (
              <Botao onClick={compartilharBackup}>Compartilhar backup</Botao>
            )}
            <label>
              Restaurar:{' '}
              <input type="file" accept=".json" onChange={restaurarBackup} />
            </label>
          </Linha>

          <SubSecao>Restaurar colando o texto (bom para o celular)</SubSecao>
          <AreaTexto
            placeholder="Cole aqui o texto do backup copiado no outro aparelho"
            value={textoBackup}
            onChange={(e) => setTextoBackup(e.target.value)}
          />
          <Linha>
            <Botao
              $tipo="primario"
              onClick={() => {
                if (aplicarBackup(textoBackup)) setTextoBackup('')
              }}
            >
              Restaurar do texto
            </Botao>
          </Linha>
        </Cartao>
      </Centro>
    </>
  )
}

export default App