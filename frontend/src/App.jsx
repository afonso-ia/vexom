import { useEffect, useMemo, useState } from 'react';
import Chart from './components/Chart';
import ScorePanel from './components/ScorePanel';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [candles, setCandles] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [score, setScore] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [lastError, setLastError] = useState('');

  useEffect(() => {
    let ws;
    let reconnectTimer;

    const connect = () => {
      ws = new WebSocket(WS_URL);
      setConnectionStatus('connecting');

      ws.onopen = () => setConnectionStatus('connected');

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'error') {
            setLastError(message.message || 'Erro desconhecido no backend');
            return;
          }

          if (message.type === 'market_update') {
            setCandles(Array.isArray(message.candles) ? message.candles : []);
            setCurrentPrice(message.currentPrice ?? null);
            setIndicators(message.indicators ?? null);
            setScore(message.score ?? null);
            setLastUpdate(message.timestamp ?? Date.now());
            setLastError('');
          }
        } catch (error) {
          console.error('Erro ao processar payload do WebSocket', error);
        }
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        reconnectTimer = setTimeout(connect, 1500);
      };

      ws.onerror = () => {
        setConnectionStatus('error');
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  const formattedUpdateTime = useMemo(() => {
    if (!lastUpdate) return '---';
    return new Date(lastUpdate).toLocaleTimeString('pt-BR');
  }, [lastUpdate]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Vortex System</h1>
        <div className={`status status-${connectionStatus}`}>WS: {connectionStatus}</div>
      </header>

      <section className="metrics-row">
        <div className="card">
          <span className="label">Preço Atual</span>
          <strong className="value">
            {Number.isFinite(currentPrice) ? `$ ${currentPrice.toLocaleString('en-US')}` : '---'}
          </strong>
        </div>
        <div className="card">
          <span className="label">Última Atualização</span>
          <strong className="value">{formattedUpdateTime}</strong>
        </div>
      </section>

      {lastError && (
        <div className="error-banner">
          <strong>Erro:</strong> {lastError}
        </div>
      )}

      <main className="main-layout">
        <Chart candles={candles} />
        <ScorePanel indicators={indicators} score={score} />
      </main>
    </div>
  );
}

export default App;
