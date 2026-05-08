"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/* Phase1: in-memory 로그인 상태.
 * - 새로고침 시 항상 logged-out으로 리셋 (의도된 동작)
 * - 곧 실제 로그인 플로우(다이얼로그/페이지) 추가 시 login() 호출 시점만 변경됨
 */

type AuthContextValue = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login: () => setIsLoggedIn(true),
        logout: () => setIsLoggedIn(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
