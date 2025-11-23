import { NextResponse } from "next/server";
import { calculateEMA, calculateMACD, calculateRSI, summarizeSignals } from "../../../lib/indicators";

function parsePair(pair) {
  if (!pair || pair.length < 6) return null;
  const base = pair.slice(0, 3).toUpperCase();
  const quote = pair.slice(3).toUpperCase();
  return { base, quote };
}

function formatDate(d) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pair = (searchParams.get("pair") || "EURUSD").toUpperCase();
  const days = Math.max(60, Math.min(1000, Number(searchParams.get("days") || "240")));
  const emaPeriod = Math.max(2, Math.min(200, Number(searchParams.get("ema") || "50")));
  const rsiPeriod = Math.max(2, Math.min(100, Number(searchParams.get("rsi") || "14")));
  const macdFast = Math.max(2, Math.min(100, Number(searchParams.get("macdFast") || "12")));
  const macdSlow = Math.max(2, Math.min(200, Number(searchParams.get("macdSlow") || "26")));
  const macdSignal = Math.max(2, Math.min(100, Number(searchParams.get("macdSignal") || "9")));

  const parsed = parsePair(pair);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid pair" }, { status: 400 });
  }
  const { base, quote } = parsed;

  // Fetch daily timeseries from exchangerate.host (free, no key)
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - (days + 40)); // extra buffer to seed indicators
  const url = `https://api.exchangerate.host/timeseries?base=${base}&symbols=${quote}&start_date=${formatDate(start)}&end_date=${formatDate(end)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }
    const data = await res.json();
    if (!data || !data.rates) {
      return NextResponse.json({ error: "No data" }, { status: 502 });
    }
    const points = Object.entries(data.rates)
      .map(([date, obj]) => ({ date, close: obj?.[quote] ?? null }))
      .filter(p => p.close != null)
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    // Ensure we have enough points
    const trimmed = points.slice(-days);
    const closes = trimmed.map(p => p.close);
    const timestamps = trimmed.map(p => p.date);

    const ema = calculateEMA(closes, emaPeriod);
    const rsi = calculateRSI(closes, rsiPeriod);
    const macdAll = calculateMACD(closes, macdFast, macdSlow, macdSignal);

    const summary = summarizeSignals({
      closes,
      ema,
      rsi,
      macd: macdAll.macd,
      signal: macdAll.signal
    });

    return NextResponse.json({
      pair,
      base,
      quote,
      timestamps,
      closes,
      ema,
      rsi,
      macd: macdAll.macd,
      macdSignal: macdAll.signal,
      macdHistogram: macdAll.histogram,
      summary
    }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

