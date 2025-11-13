"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [error, setError] = useState("");

  const requestCode = api.auth.requestVerificationCode.useMutation({
    onSuccess: () => {
      setStep("verify");
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Failed to send verification code");
    },
  });

  const verifyCode = api.auth.verifyCode.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
    onError: (err) => {
      setError(err.message || "Invalid verification code");
    },
  });

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    requestCode.mutate({ email });
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    verifyCode.mutate({ email, code });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <Card className="w-full max-w-md border-2 border-gray-200 bg-white shadow-2xl">
        <CardHeader className="space-y-4 pb-8 text-center">
          <div className="mx-auto mb-2">
            <div className="flex items-center justify-center gap-2">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent">
            Digital Menu Management
          </CardTitle>
          <CardDescription className="text-base font-medium text-gray-600">
            {step === "email"
              ? "Enter your email to receive a verification code"
              : "Enter the verification code sent to your email"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          {step === "email" ? (
            <form onSubmit={handleRequestCode} className="space-y-6" noValidate>
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold text-gray-700"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={requestCode.isPending}
                  className="h-12 text-base"
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {error && (
                <Alert
                  variant="destructive"
                  className="rounded-lg border-2 border-red-300 bg-red-50 p-3.5 shadow-sm"
                >
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-sm font-semibold text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full border-2 border-blue-600 bg-blue-600 text-base font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
                size="lg"
                disabled={requestCode.isPending || !email.trim()}
              >
                {requestCode.isPending ? (
                  <>
                    <svg
                      className="mr-2 h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Send Verification Code
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6" noValidate>
              <div className="space-y-3">
                <Label
                  htmlFor="code"
                  className="text-sm font-bold text-gray-700"
                >
                  Verification Code
                </Label>
                <div className="relative">
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                    required
                    disabled={verifyCode.isPending}
                    className="h-20 text-center text-4xl font-bold tracking-[0.3em]"
                    autoComplete="one-time-code"
                    autoFocus
                  />
                </div>
                <p className="text-center text-sm font-medium text-gray-500">
                  Check your email for the 6-digit code
                </p>
              </div>
              {error && (
                <Alert
                  variant="destructive"
                  className="rounded-lg border-2 border-red-300 bg-red-50 p-3.5 shadow-sm"
                >
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-sm font-semibold text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 font-semibold"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError("");
                  }}
                  disabled={verifyCode.isPending}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 border-2 border-blue-600 bg-blue-600 text-base font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
                  size="lg"
                  disabled={verifyCode.isPending || code.length !== 6}
                >
                  {verifyCode.isPending ? (
                    <>
                      <svg
                        className="mr-2 h-5 w-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Verify & Login
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
