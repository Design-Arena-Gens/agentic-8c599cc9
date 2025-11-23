 "use client";
 
 import {
   Chart as ChartJS,
   LineElement,
   PointElement,
   LinearScale,
   TimeSeriesScale,
   Tooltip,
   Legend,
   Filler,
   CategoryScale
 } from "chart.js";
 import { Line } from "react-chartjs-2";
 
 ChartJS.register(
   LineElement,
   PointElement,
   LinearScale,
   TimeSeriesScale,
   Tooltip,
   Legend,
   Filler,
   CategoryScale
 );
 
 export default function PriceChart({ labels, close, ema }) {
   const data = {
     labels,
     datasets: [
       {
         label: "Close",
         data: close,
         borderColor: "#60a5fa",
         backgroundColor: "rgba(96,165,250,0.15)",
         fill: true,
         tension: 0.2,
         pointRadius: 0
       },
       {
         label: "EMA",
         data: ema,
         borderColor: "#f59e0b",
         pointRadius: 0,
         tension: 0.2
       }
     ]
   };
   const options = {
     responsive: true,
     plugins: {
       legend: {
         labels: { color: "#cbd5e1" }
       },
       tooltip: {
         mode: "index",
         intersect: false
       }
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
   return <Line data={data} options={options} height={80} />;
 }
 
