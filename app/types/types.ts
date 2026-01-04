// app/types/types.ts
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

export interface EmployeeInfo {
  氏名: string;
  年齢: string;
  スキル: string;
  最寄駅: string;
  希望勤務形態: string;
  備考: string;
}

export interface MatchingResult {
  要員ID: string;
  受信日時: string;
  要員情報: EmployeeInfo;
  "案件とのマッチ度（100点満点）": number | string;
  理由コメント: string;
}

export interface MatchingResponse {
  candidates: MatchingResult[];
  推奨アクション: string[];
}

export interface FormData {
  案件名: string;
  必須スキル: string;
  単価: string;
  勤務地および勤務形態: string;
}