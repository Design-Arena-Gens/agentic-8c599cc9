export const metadata = {
  title: "Forex Trading Indicators",
  description: "RSI, MACD, EMA for popular FX pairs",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

