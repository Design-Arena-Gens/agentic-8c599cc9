 "use client";
 
 import {
   Chart as ChartJS,
   LineElement,
   PointElement,
   LinearScale,
   CategoryScale,
   Tooltip,
   Legend
 } from "chart.js";
 import { Line } from "react-chartjs-2";
 
 ChartJS.register(
   LineElement,
   PointElement,
   LinearScale,
   CategoryScale,
   Tooltip,
   Legend
 );
 
 export default function RsiChart({ labels, rsi }) {
   const seventy = rsi.map(_ => 70);
   const thirty = rsi.map(_ => 30);
   const data = {
     labels,
     datasets: [
       {
         label: "RSI",
         data: rsi,
         borderColor: "#22c55e",
         pointRadius: 0,
         tension: 0.2
       },
       {
         label: "70",
         data: seventy,
         borderColor: "rgba(239,68,68,0.6)",
         borderDash: [6, 6],
         pointRadius: 0
       },
       {
         label: "30",
         data: thirty,
         borderColor: "rgba(34,197,94,0.6)",
         borderDash: [6, 6],
         pointRadius: 0
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
         min: 0,
         max: 100,
         ticks: { color: "#94a3b8" },
         grid: { color: "rgba(255,255,255,0.06)" }
       }
     }
   };
   return <Line data={data} options={options} height={60} />;
 }
 
