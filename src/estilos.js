// Todos os estilos (aparência) do sistema ficam aqui.
// Cada "export const" abaixo é uma peça visual que os outros arquivos podem importar.
import styled, { createGlobalStyle, keyframes } from 'styled-components'

const subir = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

export const Global = createGlobalStyle`
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

export const Topo = styled.header`
  background: linear-gradient(120deg, #1e3a8a 0%, #2563eb 55%, #0d9488 100%);
  color: #fff;
  padding: 26px 0 30px;
  margin-bottom: 20px;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 8px 24px rgba(30, 58, 138, 0.25);
`
export const Centro = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
`
export const TituloTopo = styled.h1`
  margin: 0 !important;
  font-size: 30px !important;
  line-height: 1.2 !important;
  color: #fff !important;
  letter-spacing: -0.5px;
`
export const Subtitulo = styled.p`
  margin: 4px 0 18px;
  color: #bfdbfe;
  font-size: 15px;
`
export const Controles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`
export const Rotulo = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #dbeafe;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`
export const CampoTopo = styled.input`
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

export const TopoLinha = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px 28px;
`
export const Palco = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  margin-bottom: -6px;
`
export const Balao = styled.div`
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
export const Abas = styled.div`
  display: inline-flex;
  gap: 4px;
  background: #e2e8f0;
  padding: 4px;
  border-radius: 12px;
`
export const Aba = styled.button`
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
export const BarraLista = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 6px 0 14px;
`
export const GrupoCabeca = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 18px 4px 8px;
  font-weight: 700;
  color: #334155;
`
export const GrupoCaixa = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.07);
`
export const Registro = styled.article`
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
export const Principal = styled.div`
  min-width: 0;
`
export const LinhaTitulo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 16px;
`
export const Detalhe = styled.div`
  margin-top: 3px;
  font-size: 13px;
  color: #64748b;
`
export const Acoes = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`
export const Icone = styled.button`
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
export const Expandido = styled.div`
  grid-column: 1 / -1;
`

export const Usuario = styled.div`
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
export const Avatar = styled.div`
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

export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, ${(p) => p.$min || 230}px), 1fr)
  );
  gap: 14px;
  margin-bottom: 16px;
`
export const Kpi = styled.div`
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
export const KpiRotulo = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`
export const KpiValor = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.15;
  margin: 2px 0;
`
export const KpiNota = styled.div`
  font-size: 13px;
  color: #64748b;
`
export const Barra = styled.div`
  height: 8px;
  background: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 8px;
`
export const Preenchimento = styled.div`
  height: 100%;
  border-radius: 8px;
  background: ${(p) => p.$cor};
  transition: width 0.8s ease-out;
`

export const Cartao = styled.section`
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.07);
  animation: ${subir} 0.5s ease-out both;
`
export const Secao = styled.h2`
  margin: 0 0 12px !important;
  font-size: 18px !important;
  line-height: 1.3 !important;
  color: #0f172a !important;
  letter-spacing: 0 !important;
`
export const SubSecao = styled.h3`
  margin: 14px 0 8px !important;
  font-size: 15px !important;
  color: #1e3a8a !important;
`
export const Linha = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 8px 0;
`
export const Campo = styled.input`
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
export const AreaTexto = styled.textarea`
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
export const Botao = styled.button`
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
export const Selo = styled.span`
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: ${(p) => p.$cor};
`
export const Chip = styled.span`
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 13px;
  background: #f1f5f9;
  color: #475569;
`
export const Mensagem = styled.pre`
  background: #0f172a;
  color: #e2e8f0;
  padding: 12px 14px;
  border-radius: 12px;
  margin: 8px 0;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
`
export const Rolagem = styled.div`
  overflow-x: auto;
`
export const Tabela = styled.table`
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
export const Soltar = styled.div`
  border: 2px dashed ${(p) => (p.$ativo ? '#2563eb' : '#cbd5e1')};
  background: ${(p) => (p.$ativo ? '#eff6ff' : '#f8fafc')};
  border-radius: 14px;
  padding: 14px;
  margin-top: 10px;
  transition: all 0.15s;
`
export const Aviso = styled.div`
  background: ${(p) => (p.$ok ? '#ecfdf5' : '#fef2f2')};
  border: 1px solid ${(p) => (p.$ok ? '#16a34a' : '#fca5a5')};
  color: ${(p) => (p.$ok ? '#166534' : '#991b1b')};
  border-radius: 12px;
  padding: 11px 14px;
  margin-bottom: 16px;
  font-weight: 600;
`
export const AvisoDemo = styled.div`
  background: #eff6ff;
  border: 1px solid #93c5fd;
  color: #1e3a8a;
  border-radius: 12px;
  padding: 11px 14px;
  margin-bottom: 16px;
  font-weight: 600;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

export const Detalhes = styled.details`
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