import { NextResponse } from 'next/server';

// Types
interface Agent {
  id: string;
  role: 'Generator' | 'Evaluator' | 'Executor' | 'Profit-Optimizer';
  bias: string;
}

interface Proposal {
  content: string;
  metadata?: any;
}

interface ScoredProposal {
  agent: Agent;
  proposal: Proposal;
  score: number;
  clarity: number;
  originality: number;
  effectiveness: number;
  roi: number;
  adaptability: number;
  risk: number;
}

type Difficulty = 'simple' | 'medium' | 'hard';

// Core MegaSwarm Functions
function SCALE_POP(difficulty: Difficulty): number {
  const map = { simple: 8, medium: 16, hard: 24 };
  return map[difficulty];
}

function ASSIGN_ROLES(popSize: number): Agent[] {
  const roles: Agent['role'][] = ['Generator', 'Evaluator', 'Executor', 'Profit-Optimizer'];
  const agents: Agent[] = [];
  for (let i = 0; i < popSize; i++) {
    const role = roles[i % roles.length];
    agents.push({
      id: `agent-${i}`,
      role,
      bias: role === 'Generator' ? 'innovation' :
            role === 'Evaluator' ? 'quality' :
            role === 'Executor' ? 'implementation' : 'profitability'
    });
  }
  return agents;
}

// Mock LLM (replace with actual Grok API or OpenAI)
async function callLLM(prompt: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (prompt.includes('pricing')) {
    const responses = [
      'Implement dynamic pricing with ML-driven elasticity analysis, competitor monitoring, and customer segmentation to maximize revenue while maintaining market competitiveness',
      'Deploy psychological pricing ($9.99), tiered models, bundle strategies, and personalized discounts based on purchase history and customer lifetime value predictions',
      'Use A/B testing framework for price optimization, analyze conversion funnels, and focus on CLV over single-transaction profit with seasonal adjustments',
      'Leverage loss-leader products, strategic bundling, volume discounts, and market penetration pricing to build customer base and increase overall revenue'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  return 'Comprehensive solution leveraging data-driven insights, strategic automation, and measurable KPIs to achieve optimal business outcomes';
}

async function GENERATE_PROPOSAL(agent: Agent, task: string): Promise<Proposal> {
  const prompt = `As a ${agent.role} with ${agent.bias} focus, propose a solution to: ${task}`;
  const content = await callLLM(prompt);
  return { content, metadata: { agent: agent.id, role: agent.role } };
}

async function ASSESS_RISK(proposal: Proposal): Promise<number> {
  return 2 + Math.random() * 8; // 2-10 risk penalty
}

async function CALC_SCORE(agent: Agent, proposal: Proposal, task: string): Promise<ScoredProposal> {
  const clarity = 15 + Math.random() * 10;
  const originality = 15 + Math.random() * 10;
  const effectiveness = 15 + Math.random() * 10;
  const roi = 15 + Math.random() * 15;
  const adaptability = 15 + Math.random() * 10;
  const risk = await ASSESS_RISK(proposal);
  
  const weightedClarity = Math.pow(clarity, 1.25);
  const weightedROI = Math.pow(roi, 1.2);
  const score = weightedClarity + originality + effectiveness + weightedROI + adaptability - risk;
  
  return { agent, proposal, score, clarity, originality, effectiveness, roi, adaptability, risk };
}

function SELECT_TOP(population: ScoredProposal[], percentage: number): ScoredProposal[] {
  return [...population].sort((a, b) => b.score - a.score).slice(0, Math.ceil(population.length * percentage));
}

function MUTATE_CROSSOVER(parents: ScoredProposal[]): ScoredProposal[] {
  return parents; // Simplified: keep parents
}

function CALC_CONSENSUS(population: ScoredProposal[]): number {
  const scores = population.map(p => p.score);
  const avg = scores.reduce((a, b) => a + b) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
  return Math.max(0, 1 - (Math.sqrt(variance) / avg));
}

// Main API Handler
export async function POST(request: Request) {
  try {
    const { task, difficulty } = await request.json();
    
    if (!task) {
      return NextResponse.json({ error: 'Task is required' }, { status: 400 });
    }
    
    const diff = (difficulty || 'medium') as Difficulty;
    const popSize = SCALE_POP(diff);
    let population = ASSIGN_ROLES(popSize);
    
    // Generate initial proposals
    let proposals: ScoredProposal[] = [];
    for (const agent of population) {
      const proposal = await GENERATE_PROPOSAL(agent, task);
      const scored = await CALC_SCORE(agent, proposal, task);
      proposals.push(scored);
    }
    
    let generation = 1;
    const MAX_GENERATIONS = 8;
    let prevBestScore = 0;
    let stagnantGens = 0;
    let terminationReason = '';
    
    // Evolution loop
    while (generation <= MAX_GENERATIONS) {
      const champion = proposals.reduce((best, curr) => curr.score > best.score ? curr : best);
      
      const scoreDelta = champion.score - prevBestScore;
      if (scoreDelta < 4 && generation > 1) {
        stagnantGens++;
        if (stagnantGens >= 2) {
          terminationReason = 'Score delta < 4 for 2 generations';
          break;
        }
      } else {
        stagnantGens = 0;
      }
      
      if (CALC_CONSENSUS(proposals) > 0.82) {
        terminationReason = 'Consensus > 0.82';
        break;
      }
      
      if (champion.score >= 118) {
        terminationReason = 'Max score >= 118';
        break;
      }
      
      if (generation === MAX_GENERATIONS) {
        terminationReason = 'Max generations reached';
        break;
      }
      
      const selectionRate = 0.4 + Math.random() * 0.2;
      const selected = SELECT_TOP(proposals, selectionRate);
      const evolved = MUTATE_CROSSOVER(selected);
      
      proposals = evolved;
      for (let i = evolved.length; i < popSize; i++) {
        const agent = population[i % population.length];
        const proposal = await GENERATE_PROPOSAL(agent, task);
        const scored = await CALC_SCORE(agent, proposal, task);
        proposals.push(scored);
      }
      
      prevBestScore = champion.score;
      generation++;
    }
    
    const sorted = proposals.sort((a, b) => b.score - a.score);
    const champion = sorted[0];
    const runnersUp = sorted.slice(1, 4);
    
    const expectedValue = 5000 + Math.random() * 15000;
    const cost = expectedValue * (0.3 + Math.random() * 0.2);
    const time = 3 + Math.random() * 6;
    const ev = (expectedValue - cost) / time;
    const profitMargin = 20 + Math.random() * 30;
    
    return NextResponse.json({
      champion,
      runnersUp,
      roiEstimate: {
        expectedValue: ev,
        profitMargin,
        timeframe: `${time.toFixed(1)} months`,
        totalReturn: expectedValue,
        totalCost: cost
      },
      validationRoadmap: [
        'Conduct market research and competitive analysis',
        'Build MVP and run pilot test with target segment',
        'Measure key metrics: conversion, CAC, LTV',
        'Scale successful strategies with data-driven iteration'
      ],
      generations: generation - 1,
      reason: terminationReason
    });
    
  } catch (error: any) {
    console.error('MegaSwarm error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}