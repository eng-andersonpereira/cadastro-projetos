import { Cartao, Secao, Linha, Botao } from './estilos.js'

function BoasVindas({ aoVerDemo }) {
  return (
    <Cartao>
      <Secao>👋 Bem-vindo!</Secao>
      <p style={{ marginTop: 0 }}>
        Este sistema controla a produção de projetos de rede rural: cadastra,
        dá baixa, gera a mensagem de entrega e acompanha a meta do mês. Os
        dados ficam <strong>apenas no seu navegador</strong>.
      </p>
      <Linha>
        <Botao $tipo="primario" onClick={aoVerDemo}>
          ▶ Ver demonstração com dados de exemplo
        </Botao>
        <span>ou comece cadastrando no cartão “Novo projeto”.</span>
      </Linha>
    </Cartao>
  )
}

export default BoasVindas