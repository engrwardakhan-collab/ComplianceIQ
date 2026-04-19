import './globals.css';

export const metadata = {
  title: 'Contract Analyzer',
  description: 'Analyze real estate contracts with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
