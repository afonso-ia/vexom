import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

function toChartData(candles = []) {
  return candles
    .filter((candle) => candle?.openTime)
    .map((candle) => ({
      time: Math.floor(candle.openTime / 1000),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));
}

function Chart({ candles }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: '#0e1116' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#1c1f26' },
        horzLines: { color: '#1c1f26' },
      },
      width: containerRef.current.clientWidth,
      height: 520,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#2a2e39',
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    const handleResize = () => {
      if (!containerRef.current || !chartRef.current) return;
      chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current) return;
    const data = toChartData(candles);
    if (data.length === 0) {
      seriesRef.current.setData([]);
      return;
    }

    // Como recebemos snapshots completos, usar setData mantém o estado consistente.
    seriesRef.current.setData(data);
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  return (
    <section className="chart-card">
      <h2>Price Action (1h)</h2>
      <div ref={containerRef} className="chart-container" />
    </section>
  );
}

export default Chart;
