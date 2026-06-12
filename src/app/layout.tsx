import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuantumViz // Reversible Algorithmic Sandbox IDE',
  description: 'A premium algorithmic visualization environment with time-travel step playback and custom sandbox compilation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
