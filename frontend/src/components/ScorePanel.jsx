function formatValue(value, digits = 2) {
  if (!Number.isFinite(value)) return '---';
  return value.toFixed(digits);
}

function ScorePanel({ indicators, score }) {
  const scoreValue = score?.score;
  const sentiment = score?.sentiment || 'neutro';

  return (
    <aside className="score-card">
      <h2>Trading Score</h2>

      <div className="score-value">{Number.isFinite(scoreValue) ? scoreValue : '---'}</div>
      <div className={`sentiment sentiment-${sentiment}`}>{sentiment}</div>

      <div className="indicators-grid">
        <div className="indicator-item">
          <span>RSI (14)</span>
          <strong>{formatValue(indicators?.rsi14)}</strong>
        </div>
        <div className="indicator-item">
          <span>EMA (9)</span>
          <strong>{formatValue(indicators?.ema9)}</strong>
        </div>
        <div className="indicator-item">
          <span>EMA (21)</span>
          <strong>{formatValue(indicators?.ema21)}</strong>
        </div>
        <div className="indicator-item">
          <span>MACD</span>
          <strong>{formatValue(indicators?.macd?.MACD, 4)}</strong>
        </div>
        <div className="indicator-item">
          <span>Signal</span>
          <strong>{formatValue(indicators?.macd?.signal, 4)}</strong>
        </div>
        <div className="indicator-item">
          <span>Histogram</span>
          <strong>{formatValue(indicators?.macd?.histogram, 4)}</strong>
        </div>
      </div>

      <div className="reason-box">
        <h3>Racional</h3>
        <ul>
          {(score?.reasons || ['Aguardando dados...']).map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default ScorePanel;
