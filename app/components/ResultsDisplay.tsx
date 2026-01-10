import type { MatchingResult, ComparisonChart } from '../types/types';

interface ResultsDisplayProps {
  results: MatchingResult[];
  recommendedActions: string[];
  comparisonChart?: ComparisonChart[];
  onBackToForm: () => void;
}

export default function ResultsDisplay({ results, recommendedActions, comparisonChart, onBackToForm }: ResultsDisplayProps) {
  const getMatchScore = (result: MatchingResult): number => {
    const matchScore = result["マッチ度"];
    return typeof matchScore === 'string' ? parseInt(matchScore, 10) : matchScore;
  };

  const averageScore = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + getMatchScore(r), 0) / results.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">マッチング結果数</p>
          <p className="text-4xl font-bold text-blue-600">{results.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">平均マッチ度</p>
          <p className="text-4xl font-bold text-green-600">{averageScore}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={onBackToForm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            フォームへ戻る
          </button>
        </div>
      </div>

      {/* マッチング結果カード */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* ヘッダー */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="text-sm opacity-90">要員ID</p>
                  <p className="text-2xl font-bold">{result.要員ID}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">マッチ度</p>
                  <p className="text-3xl font-bold">{getMatchScore(result)}%</p>
                </div>
              </div>
            </div>

            {/* ボディ */}
            <div className="p-6 space-y-6">
              {/* 受信日時 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600">受信日時</p>
                <p className="text-lg font-semibold text-gray-800">{result.受信日時}</p>
              </div>

              {/* 要員情報 */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="text-lg font-bold text-gray-800 mb-4">要員情報</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">氏名</p>
                    <p className="font-semibold text-gray-800">{result.要員情報.氏名}（{result.要員情報.年齢}歳）</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">最寄駅</p>
                    <p className="font-semibold text-gray-800">{result.要員情報.最寄駅}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">スキル</p>
                    <p className="font-semibold text-gray-800">{result.要員情報.スキル}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">希望勤務形態</p>
                    <p className="font-semibold text-gray-800">{result.要員情報.希望勤務形態}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">備考</p>
                    <p className="text-gray-800">{result.要員情報.備考}</p>
                  </div>
                </div>
              </div>

              {/* 理由コメント */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-gray-600 mb-2">理由コメント</p>
                <p className="text-gray-800 leading-relaxed">{result.理由コメント}</p>
              </div>

              {/* アクションボタン */}
              <div className="flex justify-center pt-4">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
                  onClick={() => {
                    // 要員情報詳細表示のロジックをここに実装
                    console.log('要員情報詳細:', result.要員情報);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Z" />
                  </svg>
                  要員情報
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 比較チャート */}
      {comparisonChart && comparisonChart.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">比較チャート</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">要員名</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">スキル</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">勤務形態</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">単価</th>
                </tr>
              </thead>
              <tbody>
                {comparisonChart.map((item, index) => {
                  const personName = Object.keys(item)[0];
                  const ratings = item[personName];
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-semibold text-gray-800">{personName}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                          ratings.スキルのマッチ度 === '◎' ? 'bg-green-500' : 
                          ratings.スキルのマッチ度 === '⚪' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {ratings.スキルのマッチ度}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                          ratings.勤務形態のマッチ度 === '◎' ? 'bg-green-500' : 
                          ratings.勤務形態のマッチ度 === '⚪' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {ratings.勤務形態のマッチ度}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                          ratings.単価のマッチ度 === '◎' ? 'bg-green-500' : 
                          ratings.単価のマッチ度 === '⚪' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {ratings.単価のマッチ度}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p className="mb-2">評価基準:</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white font-bold text-xs">◎</span>
                <span>優秀</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white font-bold text-xs">⚪</span>
                <span>良好</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white font-bold text-xs">×</span>
                <span>要改善</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 全体推奨アクション */}
      {recommendedActions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">全体推奨アクション</h3>
          <ul className="space-y-3">
            {recommendedActions.map((action, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-gray-800 text-base">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* フッター */}
      <div className="flex justify-center mt-8">
        <button
          onClick={onBackToForm}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
        >
          フォームへ戻る
        </button>
      </div>
    </div>
  );
}
