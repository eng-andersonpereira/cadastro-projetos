import { useState, useEffect } from 'react'
import { baixarExcel, baixarControle } from './exportar.js'
import { montarControle, diasDoMes } from './controle.js'
import { lerNomeZip } from './zips.js'
import { lerMensagens } from './mensagens.js'
import Mascote from './Mascote.jsx'
import BoasVindas from './BoasVindas.jsx'
import Kpis from './Kpis.jsx'
import {
  gerarMensagem,
  copiar,
  interpretarDitado,
  hoje,
  formatarData,
  dinheiro,
  extensaoValida,
  mesAtual,
  gerarDemonstracao,
} from './utilidades.js'
import {
  Global,
  Topo,
  Centro,
  TituloTopo,
  Subtitulo,
  Controles,
  Rotulo,
  CampoTopo,
  TopoLinha,
  Palco,
  Balao,
  Abas,
  Aba,
  BarraLista,
  GrupoCabeca,
  GrupoCaixa,
  Registro,
  Principal,
  LinhaTitulo,
  Detalhe,
  Acoes,
  Icone,
  Expandido,
  Usuario,
  Avatar,
  Grade,
  Cartao,
  Secao,
  SubSecao,
  Linha,
  Campo,
  AreaTexto,
  Botao,
  Selo,
  Chip,
  Mensagem,
  Rolagem,
  Tabela,
  Soltar,
  Aviso,
  AvisoDemo,
  Detalhes,
} from './estilos.js'
import {
  GraficoAcumulado,
  GraficoDiario,
  GraficoMeses,
} from './Graficos.jsx'

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

  function carregarDemonstracao() {
    const demo = gerarDemonstracao()
    setProjetos(demo.projetos)
    setMetas({ ...metas, [mesAtual]: { meta: demo.meta, valor: demo.valor } })
    setMesSel(mesAtual)
  }

  function limparDemonstracao() {
    const restantes = projetos.filter((p) => !p.demo)
    setProjetos(restantes)
    if (restantes.length === 0) setMetas({})
  }

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
    projetos.length > 0 &&
    !projetos.every((p) => p.demo) &&
    (diasSemBackup === null || diasSemBackup >= 1)

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
  const emDemo = projetos.some((p) => p.demo)

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

        {emDemo && (
          <AvisoDemo>
            <span>
              🎬 Modo demonstração: todos os dados abaixo são fictícios.
            </span>
            <Botao onClick={limparDemonstracao}>Limpar demonstração</Botao>
          </AvisoDemo>
        )}

        {projetos.length === 0 && <BoasVindas aoVerDemo={carregarDemonstracao} />}

        <Kpis
          totalPostes={totalPostes}
          metaNum={metaNum}
          qtdProjetos={finalizadosDoMes.length}
          totalValor={totalValor}
          valorPoste={Number(valorDoMes)}
          metaAcumulada={metaAcumulada}
          adiantado={adiantado}
          falta={falta}
          porDia={porDia}
          diasRestantes={diasRestantes}
          mesPassado={mesPassado}
          noRitmo={noRitmo}
        />

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