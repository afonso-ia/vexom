const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const { fetchOHLCV } = require('./services/dataService');
const { calculateIndicators } = require('./services/indicatorService');
const { calculateTradingScore } = require('./services/scoreService');

const PORT = process.env.PORT || 3000;
const SYMBOL = process.env.SYMBOL || 'BTCUSDT';
const INTERVAL = process.env.INTERVAL || '1h';
const LIMIT = Number(process.env.LIMIT || 100);
const UPDATE_INTERVAL_MS = 3_000;

const app = express();
app.use(express.json());
app.use((_req, res, next) => {
  // Permite consumir o backend a partir do Vite local e facilita debug via browser.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'vortex-backend', timestamp: Date.now() });
});

/**
 * Endpoint REST opcional para inspeção manual/debug no navegador.
 */
app.get('/api/snapshot', async (_req, res) => {
  try {
    const marketData = await fetchOHLCV(SYMBOL, INTERVAL, LIMIT);
    const indicators = calculateIndicators(marketData.candles);
    const scoreData = calculateTradingScore(indicators);

    const latestCandle = marketData.candles[marketData.candles.length - 1] || null;

    res.json({
      symbol: SYMBOL,
      interval: INTERVAL,
      fetchedAt: marketData.fetchedAt,
      currentPrice: latestCandle?.close ?? null,
      candles: marketData.candles,
      indicators,
      score: scoreData,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Falha ao gerar snapshot',
      details: error.message,
    });
  }
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function broadcast(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

async function buildPayload() {
  const marketData = await fetchOHLCV(SYMBOL, INTERVAL, LIMIT);
  const indicators = calculateIndicators(marketData.candles);
  const score = calculateTradingScore(indicators);
  const latestCandle = marketData.candles[marketData.candles.length - 1] || null;

  return {
    type: 'market_update',
    symbol: SYMBOL,
    interval: INTERVAL,
    timestamp: Date.now(),
    fetchedAt: marketData.fetchedAt,
    currentPrice: latestCandle?.close ?? null,
    candles: marketData.candles,
    indicators,
    score,
  };
}

async function pushUpdateToClients() {
  if (wss.clients.size === 0) return;

  try {
    const payload = await buildPayload();
    broadcast(payload);
  } catch (error) {
    broadcast({
      type: 'error',
      timestamp: Date.now(),
      message: 'Falha ao atualizar dados de mercado',
      details: error.message,
    });
  }
}

wss.on('connection', async (socket) => {
  socket.send(
    JSON.stringify({
      type: 'info',
      message: 'Conectado ao Vortex System WebSocket',
      timestamp: Date.now(),
    })
  );

  try {
    const initialPayload = await buildPayload();
    socket.send(JSON.stringify(initialPayload));
  } catch (error) {
    socket.send(
      JSON.stringify({
        type: 'error',
        timestamp: Date.now(),
        message: 'Falha ao carregar payload inicial',
        details: error.message,
      })
    );
  }
});

setInterval(pushUpdateToClients, UPDATE_INTERVAL_MS);

server.listen(PORT, () => {
  console.log(`Vortex backend ativo em http://localhost:${PORT}`);
  console.log(`WebSocket ativo em ws://localhost:${PORT}`);
  console.log(`Par: ${SYMBOL} | Intervalo: ${INTERVAL} | Candles: ${LIMIT}`);
});
