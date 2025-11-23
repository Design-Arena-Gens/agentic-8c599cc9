"use client";

import { useEffect, useMemo, useState } from "react";
import PriceChart from "../components/PriceChart";
import MacdChart from "../components/MacdChart";
import RsiChart from "../components/RsiChart";
import PairSelector from "../components/PairSelector";

export default function Home() {
  const [pair, setPair] = useState("EURUSD");
  const [days, setDays] = useState(240);
  const [ema, setEma] = useState(50);
  const [rsi, setRsi] = useState(14);
  const [macdFast, setMacdFast] = useState(12);
  const [macdSlow, setMacdSlow] = useState(26);
  const [macdSignal, setMacdSignal] = useState(9);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const query = useMemo(() => {
    const p = new URLSearchParams({
      pair,
      days: String(days),
      ema: String(ema),
      rsi: String(rsi),
      macdFast: String(macdFast),
      macdSlow: String(macdSlow),
      macdSignal: String(macdSignal)
    });
    return `/api/forex?${p.toString()}`;
  }, [pair, days, ema, rsi, macdFast, macdSlow, macdSignal]);

  useEffect(() => {
    let closed = false;
    setLoading(true);
    setError("");
    fetch(query)
      .then(r => r.json())
      .then(j => {
        if (closed) return;
        if (j.error) {
          setError(j.error);
        } else {
          setData(j);
        }
      })
      .catch(() => {
        if (!closed) setError("Failed to fetch data");
      })
      .finally(() => {
        if (!closed) setLoading(false);
      });
    return () => {
      closed = true;
    };
  }, [query]);

  const labels = data?.timestamps ?? [];
  const close = data?.closes ?? [];
  const emaVals = data?.ema ?? [];
  const rsiVals = data?.rsi ?? [];
  const macd = data?.macd ?? [];
  const macdSig = data?.macdSignal ?? [];
  const macdHist = data?.macdHistogram ?? [];
  const summary = data?.summary;

  return (
    <main>
      <div className="container">
        <div className="header">
          <div className="title">Forex Trading Indicators</div>
          <div className="signal">
            <span className={
              summary?.summary === "Bullish" ? "badge-up" :
              summary?.summary === "Bearish" ? "badge-down" : "badge-neutral"
            }>
              {summary?.summary ?? "?"}
            </span>
            <span className="muted">Trend: {summary?.trend ?? "?"}</span>
            <span className="muted">RSI: {summary?.rsiVal ? summary.rsiVal.toFixed(1) : "?"}</span>
            <span className="muted">MACD: {summary?.macdSignal ?? "?"}</span>
          </div>
        </div>

        <div className="card">
          <PairSelector
            pair={pair} setPair={setPair}
            days={days} setDays={setDays}
            ema={ema} setEma={setEma}
            rsi={rsi} setRsi={setRsi}
            macdFast={macdFast} setMacdFast={setMacdFast}
            macdSlow={macdSlow} setMacdSlow={setMacdSlow}
            macdSignal={macdSignal} setMacdSignal={setMacdSignal}
          />
        </div>

        <div className="grid grid-2">
          <div className="card">
            <div className="muted">Price + EMA</div>
            {loading ? <div>Loading...</div> : error ? <div>{error}</div> : (
              <PriceChart labels={labels} close={close} ema={emaVals} />
            )}
          </div>
          <div className="card">
            <div className="muted">MACD</div>
            {loading ? <div>Loading...</div> : error ? <div>{error}</div> : (
              <MacdChart labels={labels} macd={macd} signal={macdSig} histogram={macdHist} />
            )}
          </div>
          <div className="card">
            <div className="muted">RSI</div>
            {loading ? <div>Loading...</div> : error ? <div>{error}</div> : (
              <RsiChart labels={labels} rsi={rsiVals} />
            )}
          </div>
        </div>

        <div className="footer">
          Data source: exchangerate.host (daily close). Indicators are educational, not financial advice.
        </div>
      </div>
    </main>
  );
}

