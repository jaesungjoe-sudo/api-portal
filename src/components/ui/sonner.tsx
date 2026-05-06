"use client";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";
import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react";

// Figma (Sonner 컴포넌트 set) 기준 아이콘 + 시맨틱 컬러 매핑.
// 인스턴스 레벨에서 `success/success` 같이 override 되는 아이콘 컬러를
// 기본 토큰(text-success/info/warning/destructive)으로 명시해 모든 토스트에 일관 적용.
function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="top-center"
      icons={{
        success: <CircleCheck className="size-4 text-success" />,
        info: <Info className="size-4 text-info" />,
        warning: <TriangleAlert className="size-4 text-warning" />,
        error: <OctagonX className="size-4 text-destructive" />,
        loading: <LoaderCircle className="size-4 animate-spin text-muted-foreground" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "flex items-center gap-1.5 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md",
          title: "text-sm font-medium text-foreground",
          description: "text-sm text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
