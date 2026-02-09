# MegaSwarm-LLM-App

A Vercel-hosted application implementing an evolutionary agent swarm with LLM-powered proposals for task optimization, including profitability metrics and convergence.

## Overview

MegaSwarm is an advanced agent swarm system that generates, scores, and evolves proposals for a given task using Large Language Models. The system employs evolutionary algorithms to iteratively improve solutions through multiple generations of agent proposals.

## Core Features

### Agent Roles

The swarm includes diverse specialized agents:
- **Generator**: Creates novel solution proposals
- **Evaluator**: Assesses and scores proposals
- **Executor**: Implements and validates solutions with tool integration
- **Profit-Optimizer**: Focuses on ROI and profitability metrics

### Population Scaling

Population size adapts based on task difficulty:
- **Simple**: 8 agents
- **Medium**: 16 agents
- **Hard**: 24 agents

### Scoring System

Proposals are evaluated across multiple weighted axes:
- **Clarity^1.25** (0-25): Precision of roles, protocol, and termination criteria
- **Originality** (0-25): Structured approach with evolutionary swarm and metrics
- **Effectiveness** (0-25): Convergence mechanisms, tool integration, and impact
- **ROI Realism^1.2** (0-30): Return on investment and profitability analysis
- **Adaptability** (0-25): Applicability across diverse domains
- **Risk Penalty**: Deducted based on LLM-assessed downsides

### Tool Routing

Executor and Profit-Optimizer agents can access external tools:
- Web search for research and validation
- Code execution for computational analysis
- API integrations for real-world data

### Evolution Loop

The system runs up to 8 generations with:
1. Selection of top 40-60% performers
2. Mutation and crossover operations
3. New proposal generation based on evolved traits

### Termination Conditions

The swarm terminates when any of the following is met:
- **Score Delta**: Less than 4 points improvement for 2 consecutive generations
- **Consensus**: Greater than 0.82 similarity via embedding comparison
- **Max Score**: Champion reaches 118+ points
- **Max Generations**: 8 generations completed

## Output

MegaSwarm provides comprehensive results:
- **Champion Proposal**: Best-performing solution
- **Top 3 Runners-up**: Alternative approaches
- **ROI Estimate**: Expected Value = (value - cost) / time, with 20-50% profit margin
- **Validation Roadmap**: 2-4 actionable implementation steps

## Applications

MegaSwarm excels in high-value domains requiring measurable ROI:
- E-commerce optimization
- Pricing strategy development
- Market analysis and betting strategies
- Business process optimization
- Product development planning

## Technology Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **LLM Integration**: Grok API / OpenAI compatible endpoints
- **Embeddings**: Vector similarity for consensus detection
- **Deployment**: Vercel

## Getting Started

```bash
# Clone the repository
git clone https://github.com/kwizzlesurp10-ctrl/MegaSwarm-LLM-App.git

# Install dependencies
cd MegaSwarm-LLM-App
npm install

# Set up environment variables
# Create .env.local with your LLM API key

# Run development server
npm run dev
```

## License

MIT
