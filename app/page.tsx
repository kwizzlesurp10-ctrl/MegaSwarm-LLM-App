'use client'
import { useState } from 'react'

interface SwarmResult {
  champion: any
  runnersUp: any[]
  roiEstimate: any
  validationRoadmap: string[]
  generations: number
  reason: string
}

export default function Home() {
  const [task, setTask] = useState('')
  const [difficulty, setDifficulty] = useState<'simple' | 'medium' | 'hard'>('medium')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SwarmResult | null>(null)
  const [error, setError] = useState('')

  const runSwarm = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/megaswarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, difficulty })
      })
      if (!res.ok) throw new Error('Failed to run swarm')
      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 text-indigo-900">MegaSwarm</h1>
        <p className="text-lg mb-8 text-gray-700">Evolutionary Agent Swarm with LLM-Powered Proposals</p>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block mb-2 font-semibold text-gray-800">Task</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
            placeholder="e.g., Optimize e-commerce pricing strategy"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          
          <label className="block mb-2 font-semibold text-gray-800">Difficulty</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-indigo-500"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
          >
            <option value="simple">Simple (8 agents)</option>
            <option value="medium">Medium (16 agents)</option>
            <option value="hard">Hard (24 agents)</option>
          </select>
          
          <button
            onClick={runSwarm}
            disabled={!task || loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Running Swarm...' : 'Run MegaSwarm'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-900">Results</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">🏆 Champion Proposal</h3>
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-md border-l-4 border-yellow-500">
                <p className="font-mono text-sm mb-2">Agent: {result.champion.agent.role}</p>
                <p className="mb-2">{result.champion.proposal.content}</p>
                <div className="flex gap-4 text-sm">
                  <span className="font-semibold">Score: {result.champion.score.toFixed(2)}</span>
                  <span>Clarity: {result.champion.clarity?.toFixed(1)}</span>
                  <span>ROI: {result.champion.roi?.toFixed(1)}</span>
                  <span>Effectiveness: {result.champion.effectiveness?.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">🥈 Top 3 Runners-up</h3>
              {result.runnersUp.map((r, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-md mb-2 border-l-4 border-gray-400">
                  <p className="text-sm font-mono mb-1">{r.agent.role}</p>
                  <p className="text-sm">{r.proposal.content}</p>
                  <span className="text-xs font-semibold">Score: {r.score.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">💰 ROI Estimate</h3>
              <div className="bg-green-50 p-4 rounded-md">
                <p>Expected Value: ${result.roiEstimate.expectedValue.toFixed(2)}</p>
                <p>Profit Margin: {result.roiEstimate.profitMargin.toFixed(0)}%</p>
                <p>Timeframe: {result.roiEstimate.timeframe}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">🗺️ Validation Roadmap</h3>
              <ol className="list-decimal list-inside space-y-2">
                {result.validationRoadmap.map((step, i) => (
                  <li key={i} className="text-gray-700">{step}</li>
                ))}
              </ol>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Generations: {result.generations} | Termination: {result.reason}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
