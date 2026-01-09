"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export type VoloAbpHttpRemoteServiceValidationErrorInfo = {
  message?: string | null | undefined;
  members?: string[] | null | undefined;
};

export type VoloAbpHttpRemoteServiceErrorInfo = {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  data?: Record<string, unknown> | null;
  validationErrors?: Array<VoloAbpHttpRemoteServiceValidationErrorInfo> | null;
};

export type VoloAbpHttpRemoteServiceErrorResponse = {
  error?: VoloAbpHttpRemoteServiceErrorInfo;
};

interface ErrorPageProps {
  errorResponse: VoloAbpHttpRemoteServiceErrorResponse;
}

export const Error: React.FC<ErrorPageProps> = ({ errorResponse }) => {
  const router = useRouter();
  const { error } = errorResponse;

  useEffect(() => {
    if (error?.code === "401") {
      router.push("/login");
    }
  }, [error, router]);

  if (!error) {
    return null;
  }

  if (error.code === "401") {
    return null; // 不渲染任何内容，因为我们正在重定向
  }

  return (
    <div className="container mx-auto p-4">
      <Alert variant="destructive">
        <AlertTitle>{error.code || "Error"}</AlertTitle>
        <AlertDescription>
          <p className="mb-2">{error.message}</p>
          {error.details && <p className="mb-2">{error.details}</p>}
          {error.validationErrors && error.validationErrors.length > 0 && (
            <ul className="list-disc pl-5 mb-2">
              {error.validationErrors.map((validationError, index) => (
                <li key={index}>
                  {validationError.message} (Fields:{" "}
                  {validationError?.members?.join(", ")})
                </li>
              ))}
            </ul>
          )}
          <Button onClick={() => router.push("/")} className="mt-4">
            Return to Home
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};
