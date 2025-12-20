// app/components/JobCard.tsx

interface Job {
  ID?: string;
  案件名?: string;
  受信日付?: string; // ← "受信日時" → "受信日付" に修正
  件名?: string;
  作業場所?: string;
  勤務形態?: string;
  単価?: string;
  時期?: string;
  必須スキル?: string;
  メール本文?: string;
}

interface JobCardProps {
  job: Job;
  onOpenMail: () => void;
}

export default function JobCard({ job, onOpenMail }: JobCardProps) {
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
    .split(/、|,/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-col gap-3 h-full">
      <div>
        <h3 className="font-semibold text-lg flex justify-between items-start">
          <span>{title}</span>
          <span className="text-xs text-slate-500 ml-2 flex-shrink-0">【{formattedReceivedAt}】</span>
        </h3>

        <p className="text-sm text-slate-600 mt-1">
          {location} ／ <span className="text-sm text-slate-600 mt-1">勤務形態: {workStyle}</span>
        </p>

        <p className="text-sm text-slate-600 mt-1">単価: {unitPrice}</p>
        <p className="text-xs text-slate-500 mt-1">時期: {startDate}</p>
        
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

      <div className="mt-2">
        <button
          type="button"
          onClick={onOpenMail}
          className="text-xs px-3 py-1 rounded bg-slate-800 text-white hover:bg-slate-700"
        >
          メール本文を見る
        </button>
      </div>
    </div>
  );
}