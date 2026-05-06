// Phase1 mock — 실제 API 연동 시 교체

export type ApiKeyStatus = "Active" | "Expired" | "Revoked";

export const EXPIRY_OPTIONS = [
  "No expiration",
  "30 days",
  "90 days",
  "365 days",
] as const;

export type ExpiryOption = (typeof EXPIRY_OPTIONS)[number];

export type ApiKey = {
  id: string;
  name: string;
  // 마스킹 표시용 (예: "ujet_a3f...") — 실제 토큰 값은 fullToken
  token: string;
  fullToken: string;
  status: ApiKeyStatus;
  owner: string;
  // null = "No expiration"
  expiresMs: number | null;
  // 정렬은 ms로, 화면 라벨은 expiresLabel/lastUsedLabel/createdLabel 고정값
  // 형식: Active = "MM/DD/YYYY - in Nd" / Expired = "MM/DD/YYYY"
  expiresLabel: string;
  lastUsedMs: number;
  // 사용 이력 없으면 "-"
  lastUsedLabel: string;
  createdMs: number;
  createdLabel: string;
  expiry: ExpiryOption;
};

const day = 86_400_000;
const minute = 60_000;

// 기준 시각 — 모듈 로드 시점. mock 라벨은 고정값으로 두어 시간 경과에 영향 받지 않음.
const ref = Date.now();

export const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: "k1",
    name: "Production",
    token: "ujet_a3f...",
    fullToken: "ujet_sk_a3f8b21c094e5ab7d23f60e158a91c4b",
    status: "Active",
    owner: "Jaesung Min",
    expiresMs: ref + 88 * day,
    expiresLabel: "04/18/2025 - in 88d",
    lastUsedMs: ref - 2 * minute,
    lastUsedLabel: "2 min ago",
    createdMs: ref - 380 * day,
    createdLabel: "04/18/2025",
    expiry: "365 days",
  },
  {
    id: "k2",
    name: "Design",
    token: "ujet_b2d...",
    fullToken: "ujet_sk_b2d75f3a1c094e5ab7d23f60e158a916",
    status: "Expired",
    owner: "Emily Tran",
    expiresMs: ref - 30 * day,
    expiresLabel: "06/30/2025",
    lastUsedMs: 0,
    lastUsedLabel: "-",
    createdMs: ref - 300 * day,
    createdLabel: "06/30/2025",
    expiry: "365 days",
  },
  {
    id: "k3",
    name: "Testing",
    token: "ujet_c4g...",
    fullToken: "ujet_sk_c4ge8b21c094e5ab7d23f60e158a91c",
    status: "Active",
    owner: "Carlos Rivera",
    expiresMs: ref + 147 * day,
    expiresLabel: "07/15/2025 - in 147d",
    lastUsedMs: ref - 10 * minute,
    lastUsedLabel: "10 min ago",
    createdMs: ref - 280 * day,
    createdLabel: "07/15/2025",
    expiry: "365 days",
  },
  {
    id: "k4",
    name: "Deployment",
    token: "ujet_d5h...",
    fullToken: "ujet_sk_d5h8b21c094e5ab7d23f60e158a91c1",
    status: "Active",
    owner: "Sofia Liu",
    expiresMs: ref + 164 * day,
    expiresLabel: "08/01/2025 - in 164d",
    lastUsedMs: ref - 15 * minute,
    lastUsedLabel: "15 min ago",
    createdMs: ref - 260 * day,
    createdLabel: "08/01/2025",
    expiry: "365 days",
  },
  {
    id: "k5",
    name: "Deployment",
    token: "ujet_d5h...",
    fullToken: "ujet_sk_d5h8b21c094e5ab7d23f60e158a91c2",
    status: "Active",
    owner: "Sofia Liu",
    expiresMs: ref + 164 * day,
    expiresLabel: "08/01/2025 - in 164d",
    lastUsedMs: ref - 15 * minute,
    lastUsedLabel: "15 min ago",
    createdMs: ref - 260 * day,
    createdLabel: "08/01/2025",
    expiry: "365 days",
  },
  {
    id: "k6",
    name: "Deployment",
    token: "ujet_d5h...",
    fullToken: "ujet_sk_d5h8b21c094e5ab7d23f60e158a91c3",
    status: "Expired",
    owner: "Sofia Liu",
    expiresMs: ref - 365 * day,
    expiresLabel: "08/01/2024",
    lastUsedMs: 0,
    lastUsedLabel: "-",
    createdMs: ref - 260 * day,
    createdLabel: "08/01/2025",
    expiry: "365 days",
  },
  {
    id: "k7",
    name: "Testing",
    token: "ujet_d7k...",
    fullToken: "ujet_sk_d7k8b21c094e5ab7d23f60e158a91c4",
    status: "Expired",
    owner: "Marcus Chen",
    expiresMs: ref - 730 * day,
    expiresLabel: "09/15/2023",
    lastUsedMs: 0,
    lastUsedLabel: "-",
    createdMs: ref - 220 * day,
    createdLabel: "09/15/2024",
    expiry: "365 days",
  },
  {
    id: "k8",
    name: "Production",
    token: "ujet_d9m...",
    fullToken: "ujet_sk_d9m8b21c094e5ab7d23f60e158a91c5",
    status: "Expired",
    owner: "Ava Tran",
    expiresMs: ref - 730 * day,
    expiresLabel: "10/30/2023",
    lastUsedMs: 0,
    lastUsedLabel: "-",
    createdMs: ref - 180 * day,
    createdLabel: "10/30/2025",
    expiry: "365 days",
  },
  {
    id: "k9",
    name: "Deployment",
    token: "ujet_d5h...",
    fullToken: "ujet_sk_d5h8b21c094e5ab7d23f60e158a91c6",
    status: "Active",
    owner: "Sofia Liu",
    expiresMs: ref + 164 * day,
    expiresLabel: "08/01/2025 - in 164d",
    lastUsedMs: ref - 15 * minute,
    lastUsedLabel: "15 min ago",
    createdMs: ref - 260 * day,
    createdLabel: "08/01/2025",
    expiry: "365 days",
  },
  {
    id: "k10",
    name: "Deployment",
    token: "ujet_d5h...",
    fullToken: "ujet_sk_d5h8b21c094e5ab7d23f60e158a91c7",
    status: "Revoked",
    owner: "Sofia Liu",
    expiresMs: ref + 164 * day,
    expiresLabel: "08/01/2025 - in 164d",
    lastUsedMs: 0,
    lastUsedLabel: "-",
    createdMs: ref - 260 * day,
    createdLabel: "08/01/2025",
    expiry: "365 days",
  },
];

// ─── Helpers ────────────────────────────────────────────────────

export function expiresSortKey(expiresMs: number | null): number {
  // "Never"는 가장 미래로 정렬
  return expiresMs ?? Number.POSITIVE_INFINITY;
}

const EXPIRY_DAYS: Record<ExpiryOption, number | null> = {
  "No expiration": null,
  "30 days": 30,
  "90 days": 90,
  "365 days": 365,
};

// 새로 생성되는 key의 expiresMs/Label 계산 — 디자인 형식 "MM/DD/YYYY - in Nd"
export function computeExpiry(expiry: ExpiryOption): {
  expiresMs: number | null;
  expiresLabel: string;
} {
  const days = EXPIRY_DAYS[expiry];
  if (days === null) {
    return { expiresMs: null, expiresLabel: "Never" };
  }
  const ms = Date.now() + days * day;
  return {
    expiresMs: ms,
    expiresLabel: `${formatDate(ms)} - in ${days}d`,
  };
}

export function formatDate(ms: number): string {
  const d = new Date(ms);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getFullYear()}`;
}

export function generateApiKeyValue(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let body = "";
  for (let i = 0; i < 32; i++) body += chars[Math.floor(Math.random() * chars.length)];
  return `ujet_sk_${body}`;
}
