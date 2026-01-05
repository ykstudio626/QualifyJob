'use client';

import { useState } from 'react';
import MatchingForm from '../components/MatchingForm';
import ResultsDisplay from '../components/ResultsDisplay';
import type { MatchingResult, ComparisonChart } from '../types/types';

interface AppState {
  results: MatchingResult[] | null;
  recommendedActions: string[];
  comparisonChart?: ComparisonChart[];
}

export default function QuickMatch() {
  const [state, setState] = useState<AppState>({
    results: null,
    recommendedActions: [],
    comparisonChart: [],
  });

  const handleResultsReceived = (results: MatchingResult[], recommendedActions: string[], comparisonChart?: ComparisonChart[]) => {
    setState({ results, recommendedActions, comparisonChart });
  };

  const handleBackToForm = () => {
    setState({ results: null, recommendedActions: [], comparisonChart: [] });
  };
  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-4">✨Quickマッチ</h2>

      {/* ここにクイックマッチのコンテンツを追加予定 */}
      <div className="text-gray-500 py-12">
        <main className="container mx-auto px-4 py-8">
        {state.results === null ? (
          <MatchingForm onResultsReceived={handleResultsReceived} />
        ) : (
          <ResultsDisplay
            results={state.results}
            recommendedActions={state.recommendedActions}
            comparisonChart={state.comparisonChart}
            onBackToForm={handleBackToForm}
          />
        )}
      </main>
      </div>
    </div>
  );
}
