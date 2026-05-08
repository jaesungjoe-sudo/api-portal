"use client";

import { useEffect, useState } from "react";

/**
 * 현재 뷰포트에 보이는 섹션 ID를 추적.
 * @param sectionIds 추적할 섹션 ID 배열
 * @param offset 뷰포트 상단 offset (default: 100)
 */
export function useScrollSpy(sectionIds: string[], offset: number = 100): string {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY + offset;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && scrollPosition >= section.offsetTop) {
          setActiveId(sectionIds[i]);
          break;
        }
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeId;
}
