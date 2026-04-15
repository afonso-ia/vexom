const axios = require('axios');

const BINANCE_BASE_URL = 'https://api.binance.com';
const DEFAULT_SYMBOL = 'BTCUSDT';
const DEFAULT_INTERVAL = '1h';
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

/**
 * Converte o formato de kline da Binance para uma estrutura previsível e tipada.
 * Isso evita que as camadas superiores precisem conhecer o índice de cada campo.
 */
function mapKlineToCandle(kline) {
  return {
    openTime: Number(kline[0]),
    open: Number(kline[1]),
    high: Number(kline[2]),
    low: Number(kline[3]),
    close: Number(kline[4]),
    volume: Number(kline[5]),
    closeTime: Number(kline[6]),
  };
}

/**
 * Busca OHLCV da Binance e retorna candles organizados para uso interno.
 */
async function fetchOHLCV(symbol = DEFAULT_SYMBOL, interval = DEFAULT_INTERVAL, limit = DEFAULT_LIMIT) {
  const sanitizedLimit = Number.isFinite(Number(limit))
    ? Math.max(1, Math.min(MAX_LIMIT, Number(limit)))
    : DEFAULT_LIMIT;

  let response;
  try {
    response = await axios.get(`${BINANCE_BASE_URL}/api/v3/klines`, {
      params: { symbol, interval, limit: sanitizedLimit },
      timeout: 10_000,
    });
  } catch (error) {
    const detail = error?.response?.data?.msg || error.message;
    throw new Error(`Erro ao buscar OHLCV da Binance: ${detail}`);
  }

  const candles = Array.isArray(response.data) ? response.data.map(mapKlineToCandle) : [];
  if (candles.length === 0) {
    throw new Error('Resposta de candles vazia para os parâmetros informados.');
  }

  return {
    symbol,
    interval,
    candles,
    fetchedAt: Date.now(),
  };
}

module.exports = {
  fetchOHLCV,
};
