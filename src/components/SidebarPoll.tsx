'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, CheckCircle } from 'lucide-react';

export default function SidebarPoll() {
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOption, setVotedOption] = useState<number | null>(null);
  const [votes, setVotes] = useState([124, 258, 87, 43]); // Mock votes
  const options = [
    "Oui, tout à fait",
    "Partiellement, à renforcer",
    "Non, pas suffisamment",
    "Sans opinion"
  ];

  useEffect(() => {
    const savedVote = localStorage.getItem('fasodiaspora-poll-vote');
    if (savedVote !== null) {
      setHasVoted(true);
      setVotedOption(parseInt(savedVote));
      // Load saved votes or add one to local
      const savedVotes = localStorage.getItem('fasodiaspora-poll-results');
      if (savedVotes) {
        setVotes(JSON.parse(savedVotes));
      }
    }
  }, []);

  const handleVote = (idx: number) => {
    const newVotes = [...votes];
    newVotes[idx] += 1;
    setVotes(newVotes);
    setVotedOption(idx);
    setHasVoted(true);
    localStorage.setItem('fasodiaspora-poll-vote', idx.toString());
    localStorage.setItem('fasodiaspora-poll-results', JSON.stringify(newVotes));
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-850 space-y-4">
      <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200 border-l-4 border-burkina-red pl-3.5 flex items-center gap-2 font-display">
        <BarChart3 className="w-4 h-4 text-burkina-red" />
        SONDAGE DU JOUR
      </h3>
      
      <p className="text-xs font-bold text-slate-700 dark:text-slate-250 leading-snug">
        Pensez-vous que la diaspora burkinabè est suffisamment impliquée dans les projets de développement nationaux ?
      </p>

      {!hasVoted ? (
        <div className="space-y-2">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleVote(idx)}
              className="w-full text-left text-xs font-semibold py-3 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all duration-200 hover:border-burkina-red hover:pl-5"
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {options.map((opt, idx) => {
            const percentage = Math.round((votes[idx] / totalVotes) * 100);
            const isUserChoice = votedOption === idx;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 truncate">
                    {opt}
                    {isUserChoice && <CheckCircle className="w-3.5 h-3.5 text-burkina-green flex-shrink-0" />}
                  </span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isUserChoice ? 'bg-burkina-red' : 'bg-slate-400 dark:bg-slate-700'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
          <div className="text-[10px] text-slate-400 text-right pt-2 font-bold">
            Total des votes : {totalVotes} • Merci pour votre participation !
          </div>
        </div>
      )}
    </div>
  );
}
