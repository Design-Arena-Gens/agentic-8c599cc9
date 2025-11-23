 "use client";
 
 const DEFAULT_PAIRS = [
   "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "USDCAD", "NZDUSD",
   "EURGBP", "EURJPY", "GBPJPY"
 ];
 
 export default function PairSelector({ pair, setPair, days, setDays, ema, setEma, rsi, setRsi, macdFast, setMacdFast, macdSlow, setMacdSlow, macdSignal, setMacdSignal }) {
   return (
     <div className="controls">
       <select className="select" value={pair} onChange={e => setPair(e.target.value)}>
         {DEFAULT_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
       </select>
       <input className="input" type="number" min={60} max={1000} value={days} onChange={e => setDays(Number(e.target.value || 240))} placeholder="Days" />
       <input className="input" type="number" min={2} max={200} value={ema} onChange={e => setEma(Number(e.target.value || 50))} placeholder="EMA" />
       <input className="input" type="number" min={2} max={100} value={rsi} onChange={e => setRsi(Number(e.target.value || 14))} placeholder="RSI" />
       <input className="input" type="number" min={2} max={100} value={macdFast} onChange={e => setMacdFast(Number(e.target.value || 12))} placeholder="MACD fast" />
       <input className="input" type="number" min={2} max={200} value={macdSlow} onChange={e => setMacdSlow(Number(e.target.value || 26))} placeholder="MACD slow" />
       <input className="input" type="number" min={2} max={100} value={macdSignal} onChange={e => setMacdSignal(Number(e.target.value || 9))} placeholder="MACD signal" />
     </div>
   );
 }
 
