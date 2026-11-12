/* Mô phỏng hệ thống: mỗi dự án có vài "luồng" (module). Mỗi luồng là một chuỗi khâu (nodes)
 * và các bước chạy qua các khâu đó, kèm nhật ký gọi API và số liệu thay đổi theo từng bước. */

export type LogKind = "in" | "out" | "ok" | "warn" | "err" | "info";

export type SimLog = {
  kind: LogKind;
  /** dòng chính, vd "POST /webhooks/tiktok" */
  text: string;
  /** phần phụ bên phải, vd "200 · 38ms" */
  meta?: string;
  /** đoạn dữ liệu (JSON rút gọn) hiển thị dưới dòng */
  body?: string;
};

export type SimStep = {
  node: number;
  title: string;
  detail: string;
  logs?: SimLog[];
  /** số liệu đổi sau bước này (gộp dần) */
  set?: Record<string, string | number>;
  /** nhấn mạnh 1 số liệu vừa đổi */
  focus?: string;
};

export type SimModule = {
  id: string;
  label: string;
  desc: string;
  nodes: string[];
  stats: { key: string; label: string }[];
  initial: Record<string, string | number>;
  steps: SimStep[];
};

export type SimSystem = {
  title: string;
  modules: SimModule[];
};
