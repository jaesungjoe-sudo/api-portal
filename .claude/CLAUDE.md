# .claude/CLAUDE.md — 작업 프로세스 (하네스)

> 루트 `CLAUDE.md`(프로젝트 룰) + `design-system/rules|patterns`(디자인 룰)를 보완하는 **세션 작업 규율**. 충돌 시 우선순위: 사용자 지시 > 루트 CLAUDE.md > 본 문서.
>
> ⚙️ 본 문서가 참조하는 hooks(`.claude/hooks/*`)·agents(`.claude/agents/*`)는 동일 하네스의 일부 — hooks 는 Phase B, agents 는 Phase C 에서 도입된다. 설치는 `install.sh`.

## 7단계 작업 프로세스

| 단계 | 내용 |
|---|---|
| 1. 이해 | 요청의 목적·성공조건 파악. 모호하면 질문. |
| 2. 분석 | 영향 범위·기존 자산(rules/components/patterns) 식별. |
| 3. 탐색 | 관련 파일·Figma 노드·토큰 인스펙트 (summary 먼저). |
| 4. 계획 | 변경 파일·단계 제시. **여기서 멈추고 승인 대기.** |
| 5. 실행 | 승인 후에만 코드 작성. 시맨틱 토큰·티어 규칙 준수. |
| 6. 검증 | `tsc --noEmit` + `next build` + 토큰/시각 대조. |
| 7. 완료 | PROGRESS.md 갱신 + commit (Phase 단위) + 보고. |

## 코드 작성 전 승인 필수

- 4단계(계획) 후 **사용자 승인 없이 5단계(실행) 진입 금지**. (탐색·읽기는 승인 불요)
- 질문에는 답만 — 묻지 않은 구현 금지.

## 금지사항 테이블

| 금지 | 사유 |
|---|---|
| 토큰 하드코딩 (hex/rgb/임의값/`var(--color-*)`) | 원칙 3 / hook 경고 |
| Figma 없는 variant·속성 임의 생성 | 원칙 12 |
| 고정 px 너비 | 원칙 11 |
| `.env*` 수정 | hook 차단 (시크릿) |
| Figma `visible:false` 노드 구현 | 원칙 8 |
| `tokens.generated.css` 직접 수정 | sync-tokens 경유만 |
| 승인 없이 실행 | 4단계 게이트 |

## Agents

- Figma 구현 → `figma-implementer` · 토큰 정합 → `token-checker` · 출시 점검 → `design-qa` · 코드 룰 스캔 → `design-reviewer`.
