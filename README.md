# Vortex System

Sistema completo de trading algorítmico com arquitetura modular:

- **Backend (Node.js + Express + WebSocket)**
- **Frontend (React + Vite + Lightweight Charts)**

## Estrutura

```text
/backend
  server.js
  services/
    dataService.js
    indicatorService.js
    scoreService.js
/frontend
  index.html
  vite.config.js
  src/
    App.jsx
    styles.css
    components/
      Chart.jsx
      ScorePanel.jsx
```

## Funcionalidades

### Backend
- Consumo de dados OHLCV da Binance (1h, 100 candles).
- Cálculo de indicadores:
  - RSI (14)
  - EMA (9, 21)
  - MACD (12, 26, 9)
- Cálculo de score de trading com racional explicativo.
- Atualização em tempo real via WebSocket a cada 3 segundos.
- Endpoint REST de snapshot: `GET /api/snapshot`.

### Frontend
- Conexão com WebSocket em `ws://localhost:3000`.
- Gráfico candlestick em estilo TradingView com Lightweight Charts.
- Painel com score, sentimento e indicadores principais.
- Reconexão automática do WebSocket em caso de queda.

## Como rodar

### 1) Backend

```bash
cd backend
npm install
node server.js
```

Backend disponível em:
- HTTP: `http://localhost:3000`
- WS: `ws://localhost:3000`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend (Vite) disponível em URL exibida no terminal (geralmente `http://localhost:5173`).

## Observações
- O backend usa Binance Spot REST (`/api/v3/klines`) para snapshots periódicos.
- Caso a Binance esteja indisponível, o sistema envia mensagens de erro no canal WebSocket sem quebrar o frontend.
- Você pode customizar no backend: `PORT`, `SYMBOL`, `INTERVAL`, `LIMIT`.
- Você pode customizar no frontend: `VITE_WS_URL` (default `ws://localhost:3000`).
