'use client';

import { useEffect, useState } from "react";
import JobCard from "./components/JobCard";
import ResultsDisplay from "./components/ResultsDisplay";
import Loader from "./components/Loader";
import { Job, MatchingResult, ComparisonChart } from './types/types';

const PAGE_SIZE = 50; // 1ページあたり件数

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // モーダル用 state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isMailOpen, setIsMailOpen] = useState(false);

  // マッチング結果用 state
  const [matchingResults, setMatchingResults] = useState<MatchingResult[] | null>(null);
  const [recommendedActions, setRecommendedActions] = useState<string[]>([]);
  const [comparisonChart, setComparisonChart] = useState<ComparisonChart[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingError, setMatchingError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setJobsLoading(true);
        setJobsError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/exec?type=anken_format`
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        console.log('API Response:', data); // デバッグ用
        console.log('First job:', data.records?.[0]); // 最初のジョブデータを確認

        const jobsArray = Array.isArray(data.records) ? data.records : [];
        setJobs(jobsArray);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setJobsError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setJobsLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const totalPages =
    jobs && jobs.length > 0 ? Math.ceil(jobs.length / PAGE_SIZE) : 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const visibleJobs = Array.isArray(jobs)
    ? jobs.slice(startIndex, startIndex + PAGE_SIZE)
    : [];

  // モーダル制御用ハンドラ
  const handleOpenMail = (job: Job) => {
    setSelectedJob(job);
    setIsMailOpen(true);
  };

  const handleCloseMail = () => {
    setIsMailOpen(false);
    setSelectedJob(null);
  };

  // マッチング処理
  const handleMatching = async (job: Job) => {
    console.log("★ JobsPage のマッチング処理:", job);
    try {
      setIsMatching(true);
      setMatchingError(null);
      console.log("★ API呼び出し開始");

      const ankenData = {
        案件名: job.案件名 || job.件名,
        必須スキル: job.必須スキル,
        単価: job.単価,
        勤務地および勤務形態: `${job.作業場所}、${job.勤務形態}`,
      };

      console.log("★ 準備された案件データ:", ankenData);

      const payload = {
        inputs: {
          action: "matching_yoin",
          anken: JSON.stringify(ankenData),
          text: "dummy"
        },
        response_mode: "blocking",
        user: "mini_match_user"
      };

      console.log("★ APIペイロード:", payload);

      const response = await fetch('/api/matching', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: JSON.stringify(payload)
        }),
      });

      console.log("★ API応答:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error (${response.status}): ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log("★ API応答データ:", data);

      if (data.status === "success" && data.result) {
        const result = data.result;
        
        if (!result.candidates || !Array.isArray(result.candidates)) {
          throw new Error("マッチング結果（candidates）は配列である必要があります");
        }

        const formatDateTime = (isoDateTime: string): string => {
          const date = new Date(isoDateTime);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${year}年${month}月${day}日 ${hours}:${minutes}`;
        };

        const formattedResults = result.candidates.map((candidate: any) => ({
          要員ID: candidate.要員ID,
          受信日時: formatDateTime(candidate.受信日時),
          要員情報: candidate.要員情報,
          マッチ度: candidate.マッチ度,
          理由コメント: candidate.理由コメント,
        }));

        setMatchingResults(formattedResults);
        setRecommendedActions(result.推奨アクション || []);
        setComparisonChart(result.比較チャート || []);
        console.log("★ マッチング結果設定完了");
      } else {
        console.error("★ Invalid response format:", data);
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("★ マッチング処理でエラーが発生:", err);
      setMatchingError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      console.log("★ マッチング処理終了");
      setIsMatching(false);
    }
  };

  // マッチング結果表示から戻る
  const handleBackToJobList = () => {
    setMatchingResults(null);
    setRecommendedActions([]);
    setComparisonChart([]);
    setMatchingError(null);
  };

  return (
    <>
      {isMatching && <Loader />}
      
      <div className="flex-1 p-6">
        {/* マッチング結果が表示される場合 */}
        {matchingResults !== null ? (
          <>
            <div className="mb-6">
              <button
                onClick={handleBackToJobList}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                案件一覧に戻る
              </button>
              <h2 className="text-xl font-bold">マッチング結果</h2>
            </div>
            <ResultsDisplay
              results={matchingResults}
              recommendedActions={recommendedActions}
              comparisonChart={comparisonChart}
              onBackToForm={handleBackToJobList}
            />
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">案件一覧</h2>

            {/* マッチングエラー */}
            {matchingError && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                マッチング処理でエラーが発生しました: {matchingError}
              </div>
            )}

            {/* ローディング */}
            {jobsLoading && (
              <div className="text-center text-blue-600 py-6 animate-pulse">
                データ取得中です… 少々お待ちください
              </div>
            )}

            {/* エラー */}
            {jobsError && !jobsLoading && (
              <div className="text-center text-red-600 py-6">
                データの取得に失敗しました。
                <br />
                時間をおいて再度お試しください。
              </div>
            )}

            {/* データ */}
            {!jobsLoading && !jobsError && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleJobs.length > 0 ? (
                    visibleJobs.map((job) => (
                      <JobCard
                        key={job.ID || job.案件名}
                        job={job}
                        onOpenMail={() => handleOpenMail(job)}
                        onMatching={handleMatching}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-6">
                      表示できる案件はありません
                    </p>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                      className={`px-3 py-1 text-sm rounded border ${
                        safePage === 1
                          ? "text-gray-400 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      前へ
                    </button>

                    <span className="text-sm text-gray-600">
                      {safePage} / {totalPages} ページ
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={safePage === totalPages}
                      className={`px-3 py-1 text-sm rounded border ${
                        safePage === totalPages
                          ? "text-gray-400 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      次へ
                    </button>
                  </div>
                )}
              </>
            )}
            {/* 共通のモーダルをここに 1 個だけ描画 */}
            {isMailOpen && selectedJob && (
              <MailModal job={selectedJob} onClose={handleCloseMail} />
            )}
          </>
        )}
      </div>
    </>
  );

  function MailModal({ job, onClose }: { job: Job; onClose: () => void }) {
    const title = job["案件名"] || job["件名"];
    const mailBody = job["メール本文"];

    return (
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-lg max-w-3xl w-[90%] max-h-[80vh] p-4 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 text-xl leading-none"
            >
              ×
            </button>
          </div>

          <pre className="whitespace-pre-wrap text-sm text-slate-800">
            {mailBody}
          </pre>
        </div>
      </div>
    );
  }
}