// Phase1 mock — 실제 API 연동 시 교체
export type Status = "Active" | "Verified" | "Deactivated" | "Invited";

export type User = {
  name: string;
  email: string;
  team: string;
  role: string;
  status: Status;
  updatedAt: string;
  updatedAtMs: number;
};

export type Team = {
  name: string;
  description: string;
  // 시스템 팀(예: Default)은 삭제 불가
  protected?: boolean;
};

const now = Date.now();
const d = (days: number) => now - days * 86400000;

export const INITIAL_USERS: User[] = [
  { name: "Kihoon Kim",      email: "kihoon@api.com",      team: "API Portal", role: "Admin",     status: "Active",      updatedAt: "04/18/2025", updatedAtMs: d(2)  },
  { name: "name",            email: "jaesung.joe@api.com", team: "API Portal", role: "Admin",     status: "Active",      updatedAt: "04/15/2025", updatedAtMs: d(5)  },
  { name: "name",            email: "jaesung.joe@api.com", team: "API Portal", role: "Admin",     status: "Verified",    updatedAt: "04/13/2025", updatedAtMs: d(7)  },
  { name: "name",            email: "jaesung.joe@api.com", team: "API Portal", role: "Manager",   status: "Active",      updatedAt: "04/08/2025", updatedAtMs: d(12) },
  { name: "name",            email: "jaesung.joe@api.com", team: "API Portal", role: "Manager",   status: "Deactivated", updatedAt: "03/30/2025", updatedAtMs: d(21) },
  { name: "name",            email: "jaesung.joe@api.com", team: "API Portal", role: "Developer", status: "Active",      updatedAt: "03/20/2025", updatedAtMs: d(31) },
  { name: "name",            email: "jaesung.joe@api.com", team: "API Portal", role: "Developer", status: "Active",      updatedAt: "03/10/2025", updatedAtMs: d(41) },
  { name: "name",            email: "jaesung.joe@api.com", team: "Default",    role: "Developer", status: "Active",      updatedAt: "03/01/2025", updatedAtMs: d(50) },
  { name: "name",            email: "jaesung.joe@api.com", team: "Default",    role: "Developer", status: "Active",      updatedAt: "02/20/2025", updatedAtMs: d(59) },
  { name: "Playground demo", email: "jaesung.joe@api.com", team: "Default",    role: "Developer", status: "Active",      updatedAt: "02/10/2025", updatedAtMs: d(69) },
];

export const INITIAL_TEAMS: Team[] = [
  {
    name: "Default",
    description:
      "Team description should be limited to a maximum of 2 lines, with an ellipsis applied to any overflowing text.",
    protected: true,
  },
  {
    name: "API Portal",
    description: "API Portal team — owns documentation, dashboards, and tooling.",
  },
];

// Phase1 mock: 모듈 레벨 mutable 스토어. 같은 클라이언트 세션 내에서
// list 페이지에서 만든 팀이 detail 페이지에서도 보이도록 유지한다.
// (Next.js App Router는 페이지 이동 시 컴포넌트가 재-mount 되어 useState init이 다시 호출되므로
// 스토어 스냅샷을 init에 넘기면 새 팀이 자동 반영됨.)
let runtimeTeams: Team[] = [...INITIAL_TEAMS];

export function getTeams(): Team[] {
  return runtimeTeams;
}

export function addTeam(team: Team): void {
  runtimeTeams = [...runtimeTeams, team];
}

export function deleteTeam(name: string): void {
  runtimeTeams = runtimeTeams.filter((t) => t.name !== name);
}

export function updateTeam(
  originalName: string,
  patch: { name: string; description: string }
): void {
  runtimeTeams = runtimeTeams.map((t) =>
    t.name === originalName ? { ...t, name: patch.name, description: patch.description } : t
  );
}

export function findTeam(name: string): Team | undefined {
  return runtimeTeams.find((t) => t.name === name);
}
