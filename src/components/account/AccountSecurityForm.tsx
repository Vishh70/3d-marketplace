"use client";

import * as React from "react";
import { Lock, MailCheck, RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type ApiMessage = {
  message: string;
};

export function AccountSecurityForm() {
  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [emailForm, setEmailForm] = React.useState({
    currentPassword: "",
    newEmail: "",
  });
  const [passwordState, setPasswordState] = React.useState<"idle" | "saving" | "success" | "error">("idle");
  const [emailState, setEmailState] = React.useState<"idle" | "saving" | "success" | "error">("idle");
  const [passwordMessage, setPasswordMessage] = React.useState("");
  const [emailMessage, setEmailMessage] = React.useState("");

  const handlePasswordChange = (field: keyof typeof passwordForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleEmailChange = (field: keyof typeof emailForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetPassword = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordState("idle");
    setPasswordMessage("");
  };

  const resetEmail = () => {
    setEmailForm({
      currentPassword: "",
      newEmail: "",
    });
    setEmailState("idle");
    setEmailMessage("");
  };

  const submitPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordState("saving");
    setPasswordMessage("");

    try {
      const response = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });
      const payload: ApiMessage = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to update password");
      }

      setPasswordState("success");
      setPasswordMessage(payload.message || "Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordState("error");
      setPasswordMessage(error instanceof Error ? error.message : "Unable to update password");
    }
  };

  const submitEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailState("saving");
    setEmailMessage("");
    try {
      const response = await fetch("/api/account/email/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailForm),
      });
      const payload: ApiMessage = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to request email change");
      }

      setEmailState("success");
      setEmailMessage(payload.message || "Verification link created");
      setEmailForm((prev) => ({ ...prev, currentPassword: "" }));
    } catch (error) {
      setEmailState("error");
      setEmailMessage(error instanceof Error ? error.message : "Unable to request email change");
    }
  };

  const passwordDirty =
    passwordForm.currentPassword.length > 0 ||
    passwordForm.newPassword.length > 0 ||
    passwordForm.confirmPassword.length > 0;
  const emailDirty =
    emailForm.currentPassword.length > 0 || emailForm.newEmail.length > 0;

  return (
    <div className="space-y-6">
      <form onSubmit={submitPassword} className="space-y-4 rounded-[28px] border border-white/10 bg-black/20 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Change password</h3>
            <p className="text-sm text-slate-500">Rotate the password for this account.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            type="password"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange("currentPassword")}
            placeholder="Current password"
            className="h-12 rounded-2xl border-white/10 bg-black/30 px-4"
          />
          <Input
            type="password"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange("newPassword")}
            placeholder="New password"
            className="h-12 rounded-2xl border-white/10 bg-black/30 px-4"
          />
        </div>
        <Input
          type="password"
          value={passwordForm.confirmPassword}
          onChange={handlePasswordChange("confirmPassword")}
          placeholder="Confirm new password"
          className="h-12 rounded-2xl border-white/10 bg-black/30 px-4"
        />

        {passwordMessage && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              passwordState === "error"
                ? "border-red-500/20 bg-red-500/10 text-red-200"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
            }`}
          >
            {passwordMessage}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="submit"
            disabled={!passwordDirty || passwordState === "saving"}
            className="h-11 rounded-xl bg-primary px-5 font-bold text-white hover:bg-primary/90"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            {passwordState === "saving" ? "Updating..." : "Update password"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetPassword}
            className="h-11 rounded-xl border-white/10 px-5 font-bold"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </form>

      <form onSubmit={submitEmail} className="space-y-4 rounded-[28px] border border-white/10 bg-black/20 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
            <MailCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Change email</h3>
            <p className="text-sm text-slate-500">A verification link must be opened to finalize the change.</p>
          </div>
        </div>

        <Input
          type="email"
          value={emailForm.newEmail}
          onChange={handleEmailChange("newEmail")}
          placeholder="new@email.com"
          className="h-12 rounded-2xl border-white/10 bg-black/30 px-4"
        />
        <Input
          type="password"
          value={emailForm.currentPassword}
          onChange={handleEmailChange("currentPassword")}
          placeholder="Current password"
          className="h-12 rounded-2xl border-white/10 bg-black/30 px-4"
        />

        {emailMessage && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              emailState === "error"
                ? "border-red-500/20 bg-red-500/10 text-red-200"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
            }`}
          >
            <p>{emailMessage}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="submit"
            disabled={!emailDirty || emailState === "saving"}
            className="h-11 rounded-xl bg-primary px-5 font-bold text-white hover:bg-primary/90"
          >
            <MailCheck className="mr-2 h-4 w-4" />
            {emailState === "saving" ? "Generating..." : "Request change"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetEmail}
            className="h-11 rounded-xl border-white/10 px-5 font-bold"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
