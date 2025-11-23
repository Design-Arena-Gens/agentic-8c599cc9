 "use client";
 
 import {
   Chart as ChartJS,
   BarElement,
   LineElement,
   PointElement,
   LinearScale,
   CategoryScale,
   Tooltip,
   Legend
 } from "chart.js";
 import { Chart } from "react-chartjs-2";
 
 ChartJS.register(
   BarElement,
   LineElement,
   PointElement,
   LinearScale,
   CategoryScale,
   Tooltip,
   Legend
 );
 
 export default function MacdChart({ labels, macd, signal, histogram }) {
   const data = {
     labels,
     datasets: [
       {
         type: "bar",
         label: "Histogram",
         data: histogram,
         backgroundColor: histogram.map(v =>
           v == null ? "rgba(0,0,0,0)" : v >= 0 ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)"
         ),
         borderSkipped: false,
         barPercentage: 1.0,
         categoryPercentage: 1.0
       },
       {
         type: "line",
         label: "MACD",
         data: macd,
         borderColor: "#60a5fa",
         pointRadius: 0,
         tension: 0.2
       },
       {
         type: "line",
         label: "Signal",
         data: signal,
         borderColor: "#f59e0b",
         pointRadius: 0,
         tension: 0.2
       }
     ]
   };
   const options = {
     responsive: true,
     plugins: {
       legend: { labels: { color: "#cbd5e1" } }
     },
     scales: {
       x: {
         ticks: { color: "#94a3b8", maxRotation: 0 },
         grid: { color: "rgba(255,255,255,0.06)" }
       },
       y: {
         ticks: { color: "#94a3b8" },
         grid: { color: "rgba(255,255,255,0.06)" }
       }
     }
   };
   return <Chart type="bar" data={data} options={options} height={60} />;
 }
 
