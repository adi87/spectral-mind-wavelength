import React from 'react';
import { Team } from '../types';
import { Button } from './Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ScoreboardProps {
  teams: Team[];
  onRestart: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ teams, onRestart }) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  const colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-400 mb-2">Game Over</h1>
        <div className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
            {winner.name} Wins!
        </div>
        <p className="text-xl text-white">Total Score: {winner.score}</p>
      </div>

      <div className="w-full h-64 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teams} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {teams.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full max-w-sm">
        <Button onClick={onRestart} fullWidth>Play Again</Button>
      </div>
    </div>
  );
};