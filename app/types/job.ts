// app/types/job.ts
export interface Job {
  ID?: string;
  案件名?: string;
  受信日付?: string;
  件名?: string;
  作業場所?: string;
  勤務形態?: string;
  単価?: string;
  時期?: string;
  稼働日付?: string; // jobs.tsxで使用
  必須スキル?: string;
  メール本文?: string;
}