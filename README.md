# ⚡ Cadastro de Projetos

Sistema web para controlar a produção de projetos de rede elétrica rural: cadastra cada projeto que chega, dá baixa na entrega, gera a mensagem padrão para o WhatsApp e acompanha a meta do mês com gráficos.

> Criado para resolver um problema real do meu trabalho, que antes era feito com planilha e mensagens digitadas à mão.
> Todas as imagens abaixo usam **dados fictícios**.

🔗 **Demo:** https://cadastro-projetos.vercel.app

> Ao abrir o link pela primeira vez, clique em **“Ver demonstração com dados de exemplo”** para ver o sistema funcionando com dados fictícios.

![Visão geral](docs/visao-geral.png)

## O problema

Cada projeto chega como um arquivo `.zip` e precisa ser entregue com uma mensagem em formato fixo (SS, nota, extensão da rede, licença ambiental e quantidade de postes). No fim do mês, o controle precisa bater com o da empresa. Digitar tudo à mão gerava erros (como uma extensão `667` no lugar de `0,667`) e tomava tempo.

## Funcionalidades

- **Cadastro rápido:** arraste o zip e o app lê o SS e a nota pelo nome do arquivo (`SS_RD_PROJETO_NOTA_R00.zip`), ou cadastre por **ditado de voz**.
- **Reenvios:** reconhece o sufixo `-EX` e preserva o SS exatamente como veio.
- **Dar baixa:** informa postes, extensão, licença e data de entrega, com validações contra valores absurdos.
- **Mensagem de entrega pronta:** gerada no formato padrão, copiada com um clique, inclusive **em lote** para todos os projetos do dia.
- **Meta do mês:** resumo com acumulado, situação (no ritmo ou atrasado), quanto falta, quanto precisa por dia e valor.
- **Gráficos feitos do zero em SVG:** evolução no mês contra a meta, produção por dia e histórico mensal.
- **Controle diário** em tabela, exportável para Excel (CSV).
- **Importar mensagens antigas:** cole várias mensagens de entrega e o app reconstrói o histórico.
- **Backup:** arquivo `.json` ou texto copiado, com lembrete quando passa um dia sem backup.
- **Modo demonstração:** um botão carrega dados fictícios para conhecer o sistema sem cadastrar nada.
- **Mascote animado:** um trabalhador que dança quando a produção está no ritmo e fica triste quando está atrasada. 👷

| No ritmo | Atrasado |
|---|---|
| ![Feliz](docs/trabalhador-feliz.gif) | ![Triste](docs/trabalhador-triste.gif) |

![Lista de projetos](docs/lista-projetos.png)

## Tecnologias

- React + Vite
- styled-components
- Gráficos em SVG puro, sem biblioteca de gráficos
- Web Speech API (ditado de voz, no Chrome)
- localStorage para guardar os dados no próprio navegador

## Como executar

Requisitos: [Node.js](https://nodejs.org) (versão LTS).

```bash
git clone https://github.com/eng-andersonpereira/cadastro-projetos.git
cd cadastro-projetos
npm install
npm run dev
```

O app abre em `http://localhost:5173`. Para gerar a versão de produção:

```bash
npm run build
```

## Como usar

1. Defina a **meta do mês** e o **valor por poste** no cabeçalho.
2. Arraste o zip do projeto em **Novo projeto** e confira o SS e a nota.
3. Quando terminar o projeto, clique em **Dar baixa** e preencha os dados.
4. Use **Copiar mensagens do dia** e cole no WhatsApp.
5. Baixe um **backup** com frequência.

## Estrutura

```
src/
├── App.jsx        # telas e estado da aplicação
├── Graficos.jsx   # gráficos em SVG
├── Mascote.jsx    # trabalhador animado
├── controle.js    # cálculo do controle diário e da meta
├── exportar.js    # exportação para Excel (CSV)
├── mensagens.js   # leitura de mensagens de entrega antigas
└── zips.js        # leitura do nome do arquivo zip
```

## Privacidade

O app **não tem servidor**: os dados ficam apenas no navegador de quem usa (localStorage). Nada é enviado para a internet. Por isso existe o backup.

## Próximos passos

- Dividir o `App.jsx` em componentes menores e testar as funções de cálculo.
- Versão com servidor e banco de dados, para vários usuários compartilharem os mesmos dados.
- Comparativo automático com o controle da empresa.

## Autor

Feito por **Anderson Pereira**, estudante de Engenharia de Software, durante os estudos de desenvolvimento full stack.