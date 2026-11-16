
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";

const OWNER_ID = "d6d7f71f-92e7-4caa-a3cb-b09c9590b70a";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type StaffRole = "full_admin" | "manager" | "moderator";

export default function StaffManagementPage() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("manager");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    let active = true;

    const checkOwner = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        setAuthorized(false);
        setChecking(false);
        return;
      }

      setAuthorized(data.user.id === OWNER_ID);
      setChecking(false);
    };

    checkOwner();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkOwner();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setMessageType("error");
      setMessage("Please enter an email address.");
      return;
    }

    if (!/^[^\s@]+@gmail\.com$/.test(cleanEmail)) {
      setMessageType("error");
      setMessage("Please enter a valid Gmail address.");
      return;
    }

    setSending(true);

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        throw new Error("Your login session has expired. Please log in again.");
      }

      const { data, error } = await supabase.functions.invoke(
        "invite-staff",
        {
          body: {
            email: cleanEmail,
            role,
          },
        }
      );

      if (error) {
        let details = error.message;

        try {
          const response = error.context;
          if (response && typeof response.json === "function") {
            const body = await response.json();
            details = body.error || details;
          }
        } catch {
          // Keep the original error message.
        }

        throw new Error(details);
      }

      if (!data?.success) {
        throw new Error(data?.error || "Invitation could not be sent.");
      }

      setMessageType("success");
      setMessage(`Invitation sent successfully to ${cleanEmail}.`);
      setEmail("");
      setRole("manager");
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-[#faf5ef] flex items-center justify-center p-6">
        <p className="text-[#6f1d35] font-semibold">Checking access...</p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#faf5ef] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-[#6f1d35]">
            Access Denied
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Only the Owner account can access Staff Management.
            Please log in with your Owner account.
          </p>
          <a
            href="/admin"
            className="mt-6 inline-block rounded-xl bg-[#6f1d35] px-6 py-3 font-semibold text-white"
          >
            Go to Admin Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf5ef] p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a77b54]">
            Cat&apos;s World Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#6f1d35] sm:text-4xl">
            Staff Management
          </h1>
          <p className="mt-2 text-gray-600">
            Invite and assign roles to your team members.
          </p>
        </div>

        <div className="rounded-2xl border border-[#eaded2] bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5e8e9] text-2xl">
              👑
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#6f1d35]">
                Invite New Staff
              </h2>
              <p className="text-sm text-gray-500">
                Owner permission required
              </p>
            </div>
          </div>

          <form onSubmit={handleInvite} className="space-y-6">
            <div>
              <label
                htmlFor="staff-email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Staff Gmail Address
              </label>
              <input
                id="staff-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@gmail.com"
                required
                disabled={sending}
                className="w-full rounded-xl border border-[#e5d7cb] bg-[#fffdfb] px-4 py-3 text-gray-800 outline-none transition focus:border-[#6f1d35] focus:ring-2 focus:ring-[#6f1d35]/10 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="staff-role"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Select Staff Role
              </label>
              <select
                id="staff-role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as StaffRole)
                }
                disabled={sending}
                className="w-full rounded-xl border border-[#e5d7cb] bg-[#fffdfb] px-4 py-3 text-gray-800 outline-none focus:border-[#6f1d35] focus:ring-2 focus:ring-[#6f1d35]/10 disabled:opacity-60"
              >
                <option value="manager">Manager</option>
                <option value="moderator">Moderator</option>
                <option value="full_admin">Full Admin</option>
              </select>
            </div>

            <div className="rounded-xl bg-[#faf5ef] p-4">
              <p className="mb-2 text-sm font-bold text-[#6f1d35]">
                Role Information
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <strong>Full Admin:</strong> Manage most admin operations.
                </li>
                <li>
                  <strong>Manager:</strong> Manage assigned store operations.
                </li>
                <li>
                  <strong>Moderator:</strong> Handle limited moderation tasks.
                </li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                Only the Owner can invite staff and assign Full Admin roles.
              </p>
            </div>

            {message && (
              <div
                role="alert"
                className={`rounded-xl p-4 text-sm font-medium ${
                  messageType === "success"
                    ? "border border-green-200 bg-green-50 text-green-800"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-xl bg-[#6f1d35] px-6 py-4 font-bold text-white shadow-md transition hover:bg-[#541329] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Sending Invitation..." : "Send Staff Invitation"}
            </button>
          </form>
        </div>

        <div className="mt-6 rounded-xl border border-[#eaded2] bg-white p-5">
          <h3 className="font-bold text-[#6f1d35]">
            Important Security Information
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Staff invitations are processed through the Supabase Edge
            Function. The server checks the Owner role before creating
            an invitation. This page does not contain your service role key.
          </p>
        </div>
      </div>
    </main>
  );
}
