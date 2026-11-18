
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export default function AcceptInvitePage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    const initializeInvitation = async () => {
      try {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        const code = params.get("code");
        const tokenHash = params.get("token_hash");
        const type = params.get("type");

        const accessToken = new URLSearchParams(
          url.hash.replace(/^#/, "")
        ).get("access_token");

        const refreshToken = new URLSearchParams(
          url.hash.replace(/^#/, "")
        ).get("refresh_token");

        const authError =
          params.get("error_description") ||
          params.get("error") ||
          new URLSearchParams(
            url.hash.replace(/^#/, "")
          ).get("error_description");

        if (authError) {
          throw new Error(authError);
        }

        if (code) {
          const { error } =
            await supabase.auth.exchangeCodeForSession(code);

          if (error) throw error;
        } else if (tokenHash && type === "invite") {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "invite",
          });

          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;
        }

        const { data, error } =
          await supabase.auth.getSession();

        if (error) throw error;

        if (active) {
          setHasSession(!!data.session);
        }

        if (
          code ||
          tokenHash ||
          accessToken ||
          refreshToken
        ) {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
      } catch (error) {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Invitation verification failed."
          );
          setHasSession(false);
        }
      } finally {
        if (active) setChecking(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (active) {
          setHasSession(!!session);
        }
      }
    );

    initializeInvitation();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setMessage("");

    if (!hasSession) {
      setMessage(
        "Invitation session is missing or expired. Please open the latest invitation email."
      );
      return;
    }

    if (password.length < 8) {
      setMessage(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSuccess(true);

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f8f3ec] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-[#eaded5]">
        <div className="text-center mb-8">
          <p className="text-[#8b2635] text-sm font-semibold tracking-[0.25em]">
            PREMIUM PET STORE
          </p>

          <h1 className="text-3xl font-bold text-[#702331] mt-3">
            Cat’s World
          </h1>

          <p className="text-gray-500 mt-3">
            Welcome to our Staff Team!
          </p>
        </div>

        {checking ? (
          <p className="text-center text-gray-600">
            Checking your invitation...
          </p>
        ) : !hasSession ? (
          <div className="text-center">
            <p className="text-red-700 mb-5">
              {message ||
                "Your invitation session is missing or expired. Please open the latest invitation email again."}
            </p>

            <a
              href="/admin"
              className="inline-block rounded-lg bg-[#802638] px-6 py-3 text-white font-semibold"
            >
              Go to Admin Login
            </a>
          </div>
        ) : success ? (
          <p className="text-center text-green-700">
            Password successfully created! Redirecting...
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Create Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter new password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#802638]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#802638]"
              />
            </div>

            {message && (
              <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-[#802638] px-6 py-3 text-white font-semibold hover:bg-[#702331] disabled:opacity-60"
            >
              {saving
                ? "Creating Password..."
                : "Create Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
