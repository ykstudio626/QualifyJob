'use client';

import { useState } from 'react';
import MatchingForm from '../components/MatchingForm';
import ResultsDisplay from '../components/ResultsDisplay';
import type { MatchingResult } from '../types/types';

interface AppState {
  results: MatchingResult[] | null;
  recommendedActions: string[];
}

export default function QuickMatch() {
  const [state, setState] = useState<AppState>({
    results: null,
    recommendedActions: [],
  });

  const handleResultsReceived = (results: MatchingResult[], recommendedActions: string[]) => {
    setState({ results, recommendedActions });
  };

  const handleBackToForm = () => {
    setState({ results: null, recommendedActions: [] });
  };
  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-4">クイックマッチ</h2>

      {/* ここにクイックマッチのコンテンツを追加予定 */}
      <div className="text-center text-gray-500 py-12">
        <main className="container mx-auto px-4 py-8">
        {state.results === null ? (
          <MatchingForm onResultsReceived={handleResultsReceived} />
        ) : (
          <ResultsDisplay 
            results={state.results}
            recommendedActions={state.recommendedActions}
            onBackToForm={handleBackToForm} 
          />
        )}
      </main>
      </div>
    </div>
  );
}