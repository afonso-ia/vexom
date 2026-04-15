const { RSI, EMA, MACD } = require('technicalindicators');

function round(value, decimals = 4) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return Number(value.toFixed(decimals));
}

function getLast(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[arr.length - 1];
}

/**
 * Calcula indicadores técnicos com proteção para cenários de dados insuficientes.
 */
function calculateIndicators(candles = []) {
  const closes = candles.map((candle) => candle.close).filter((v) => Number.isFinite(v));

  const rsiSeries = closes.length >= 14 ? RSI.calculate({ values: closes, period: 14 }) : [];
  const ema9Series = closes.length >= 9 ? EMA.calculate({ values: closes, period: 9 }) : [];
  const ema21Series = closes.length >= 21 ? EMA.calculate({ values: closes, period: 21 }) : [];
  const macdSeries =
    closes.length >= 35
      ? MACD.calculate({
          values: closes,
          fastPeriod: 12,
          slowPeriod: 26,
          signalPeriod: 9,
          SimpleMAOscillator: false,
          SimpleMASignal: false,
        })
      : [];

  const lastMacd = getLast(macdSeries);

  return {
    rsi14: round(getLast(rsiSeries), 2),
    ema9: round(getLast(ema9Series), 2),
    ema21: round(getLast(ema21Series), 2),
    macd: {
      MACD: round(lastMacd?.MACD, 4),
      signal: round(lastMacd?.signal, 4),
      histogram: round(lastMacd?.histogram, 4),
    },
  };
}

module.exports = {
  calculateIndicators,
};
