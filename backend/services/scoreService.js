/**
 * Sistema simples de score:
 * - RSI em sobrecompra/sobrevenda pesa sinal contrário de reversão
 * - Cruzamento EMA favorece tendência
 * - MACD acima/abaixo do sinal confirma momentum
 *
 * Score final normalizado entre -100 e +100.
 */
function calculateTradingScore(indicators) {
  let score = 0;
  const reasons = [];

  const rsi = indicators?.rsi14;
  const ema9 = indicators?.ema9;
  const ema21 = indicators?.ema21;
  const macd = indicators?.macd?.MACD;
  const signal = indicators?.macd?.signal;

  if (Number.isFinite(rsi)) {
    if (rsi < 30) {
      score += 35;
      reasons.push('RSI em sobrevenda (<30): viés comprador');
    } else if (rsi > 70) {
      score -= 35;
      reasons.push('RSI em sobrecompra (>70): viés vendedor');
    } else {
      reasons.push('RSI neutro');
    }
  } else {
    reasons.push('RSI indisponível');
  }

  if (Number.isFinite(ema9) && Number.isFinite(ema21)) {
    if (ema9 > ema21) {
      score += 40;
      reasons.push('EMA9 acima da EMA21: tendência de alta');
    } else if (ema9 < ema21) {
      score -= 40;
      reasons.push('EMA9 abaixo da EMA21: tendência de baixa');
    } else {
      reasons.push('EMA9 e EMA21 em equilíbrio');
    }
  } else {
    reasons.push('EMAs indisponíveis');
  }

  if (Number.isFinite(macd) && Number.isFinite(signal)) {
    if (macd > signal) {
      score += 25;
      reasons.push('MACD acima do sinal: momentum positivo');
    } else if (macd < signal) {
      score -= 25;
      reasons.push('MACD abaixo do sinal: momentum negativo');
    } else {
      reasons.push('MACD neutro');
    }
  } else {
    reasons.push('MACD indisponível');
  }

  // Garante limites claros para consumo no frontend.
  score = Math.max(-100, Math.min(100, score));

  let sentiment = 'neutro';
  if (score >= 40) sentiment = 'bullish';
  if (score <= -40) sentiment = 'bearish';

  return {
    score,
    sentiment,
    reasons,
  };
}

module.exports = {
  calculateTradingScore,
};
