'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '../../components/AppLayout';
import type { Job } from '../../types/types';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const jobId = params.id as string;

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/exec?type=anken_format&id=${jobId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Job Detail API Response:', data);

      const jobData = Array.isArray(data.records) ? data.records[0] : data.records;
      
      if (!jobData) {
        throw new Error('案件が見つかりませんでした');
      }

      setJob(jobData);
    } catch (err) {
      console.error('Job fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout activePage="jobs">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">案件情報を読み込み中...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !job) {
    return (
      <AppLayout activePage="jobs">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
            <h1 className="text-2xl font-bold text-red-600 mb-4">エラー</h1>
            <p className="text-gray-700 mb-4">
              {error || '案件情報の取得に失敗しました'}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={fetchJob}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
              >
                再試行
              </button>
              <button 
                onClick={() => router.push('/jobs')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200"
              >
                一覧に戻る
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activePage="jobs">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <button 
              onClick={() => router.push('/jobs')}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              案件一覧に戻る
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {job.案件名 || job.件名}
            </h1>
            <p className="text-gray-600">案件ID: {job.ID}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  基本情報
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">作業場所</label>
                    <p className="text-lg text-gray-900">{job.作業場所 || '未設定'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">勤務形態</label>
                    <p className="text-lg text-gray-900">{job.勤務形態 || '未設定'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">単価</label>
                    <p className="text-lg font-semibold text-green-600">{job.単価 || '未設定'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">時期</label>
                    <p className="text-lg text-gray-900">{job.時期 || '未設定'}</p>
                  </div>
                </div>
              </div>

              {job.必須スキル && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    必須スキル
                  </h2>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-line">{job.必須スキル}</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  詳細情報
                </h2>
                <div className="space-y-4">
                  {job.件名 && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">件名</h3>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded">{job.件名}</p>
                    </div>
                  )}
                  {job.メール本文 && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">詳細内容</h3>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className="text-gray-800 whitespace-pre-wrap text-sm">{job.メール本文}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">アクション</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    マッチング実行
                  </button>
                  <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    お気に入り
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">案件サマリー</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">案件ID</span>
                    <span className="text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded">{job.ID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ステータス</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      募集中
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">関連リンク</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => router.push('/jobs')}
                    className="w-full text-left text-blue-600 hover:text-blue-800 text-sm py-1 transition duration-200"
                  >
                    → 案件一覧に戻る
                  </button>
                  <button 
                    onClick={() => router.push('/')}
                    className="w-full text-left text-blue-600 hover:text-blue-800 text-sm py-1 transition duration-200"
                  >
                    → ダッシュボード
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}