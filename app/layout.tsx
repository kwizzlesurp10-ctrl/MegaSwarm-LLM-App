import './globals.css'

export const metadata = {
  title: 'MegaSwarm LLM App',
  description: 'Evolutionary agent swarm with LLM-powered proposals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
