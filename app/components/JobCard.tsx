// app/components/JobCard.tsx
import { useState } from 'react';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Job } from '../types/types';

interface JobCardProps {
  job: Job;
  onOpenMail: () => void;
}

export default function JobCard({ job, onOpenMail }: JobCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  console.log('JobCard received job:', job); // デバッグ用
  console.log('受信日付 field:', job["受信日付"]); // デバッグ用
  console.log('JobCard received job:', job); // デバッグ用
  console.log('受信日付 field:', job["受信日付"]); // デバッグ用
  
  const title = job["案件名"] || job["件名"];
  const recieved_at = job["受信日付"];
  const location = job["作業場所"];
  const workStyle = job["勤務形態"];
  const unitPrice = job["単価"];
  const startDate = job["時期"];

  // 日付フォーマット（1行）
  const formatDate = (dateString: string | undefined): string =>
    dateString ? (() => {
      try {
        const d = new Date(dateString);
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
      } catch {
        return dateString;
      }
    })() : "err";

  const formattedReceivedAt = formatDate(recieved_at);

  const skills = (job["必須スキル"] || "")
    // .split(/、|,/)
    .split(/-\s/)
    .map((s) => s.trim())
    .filter(Boolean);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-col gap-3 h-full relative">
      <div>
        <h3 className="font-semibold text-lg flex justify-between items-start">
          <span>{title}</span>
          <span className="text-xs text-slate-500 ml-2 flex-shrink-0 font-normal">{formattedReceivedAt}</span>
        </h3>

        <p className="text-sm text-slate-600 mt-1">
          {location} ／ <span className="text-sm text-slate-600 mt-1">勤務形態: {workStyle}</span>
        </p>

        <p className="text-sm mt-1 text-slate-600 font-medium"><span className="font-semibold text-slate-600">単価: </span>{unitPrice}</p>
        <p className="text-sm mt-1 text-slate-600 font-medium"><span className="font-semibold text-slate-600">時期: </span>{startDate}</p>
        
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-block text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto">
        <button
          type="button"
          onClick={onOpenMail}
          className="text-sm px-3 py-1 rounded bg-slate-800 text-white hover:bg-slate-700"
        >
          メール本文を見る
        </button>
        <button
          type="button"
          className="text-sm px-3 py-1 ml-3 rounded bg-green-600 text-white hover:bg-slate-700"
        >
          見合う要員を探す
        </button>
      </div>

      {/* お気に入りハートマーク */}
      <button
        type="button"
        onClick={handleFavoriteClick}
        className="absolute bottom-3 right-3 w-4 h-4 transition-colors duration-200 hover:scale-110"
      >
        {isFavorite ? (
          <HeartIconSolid className="w-4 h-4 text-red-500" />
        ) : (
          <HeartIconOutline className="w-4 h-4 text-gray-400 hover:text-red-400" />
        )}
      </button>
    </div>
  );
}