
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type StaffRole = "full_admin" | "manager" | "moderator";

const OWNER_ID = "d6d7f71f-92e7-4caa-a3cb-b09c9590670a";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function StaffManagementPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("manager");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function checkOwner() {
      const { data, error } = await supabase.auth.getUser();

      if (!error && data.user?.id === OWNER_ID) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }

      setLoading(false);
    }

    checkOwner();
  }, []);

  async function addStaff() {
    setMessage("");
    setSuccess(false);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!cleanEmail.endsWith("@gmail.com")) {
      setMessage("Please use a Gmail address.");
      return;
    }

    setSending(true);

    try {
      const { data: sessionData } =
        await supabase.auth.getSession();

      if (!sessionData.session) {
        throw new Error("Please log in again.");
      }

      if (sessionData.session.user.id !== OWNER_ID) {
        throw new Error("Only the Owner can add staff.");
      }

      const { data, error } =
        await supabase.functions.invoke("invite-staff", {
          body: {
            email: cleanEmail,
            role: role,
          },
        });

      if (error) {
        let details = error.message;

        if (error.context instanceof Response) {
          const result = await error.context.json();
          details = result.error || details;
        }

        throw new Error(details);
      }

      if (!data?.success) {
        throw new Error(data?.error || "Invitation failed.");
      }

      setSuccess(true);
      setMessage(
        `Invitation sent to ${cleanEmail} as ${role.replace("_", " ")}.`
      );
      setEmail("");
    } catch (err) {
      setSuccess(false);
      setMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f8f3ed]">
        <p className="text-[#7b263e]">Checking Owner access...</p>
      </main>
    );
  }

  if (!isOwner) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f8f3ed] p-5">
        <div className="bg-white rounded-2xl p-7 shadow max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#7b263e]">
            Access Denied
          </h1>
          <p className="text-gray-600 mt-3">
            Only the Cat's World Owner can access Staff Management.
          </p>
          <a href="/admin" className="inline-block mt-5 text-[#7b263e] underline">
            Back to Admin Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed] p-4 md:p-8 text-[#3b1822]">
      <div className="max-w-3xl mx-auto">

        <a
          href="/admin/dashboard"
          className="text-sm text-[#7b263e] underline"
        >
          ← Back to Dashboard
        </a>

        <h1 className="text-3xl font-bold mt-5">
          Staff Management
        </h1>

        <p className="text-gray-600 mt-2 mb-8">
          Invite and manage your Cat's World team.
        </p>

        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-5">
            Invite New Staff
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Staff Gmail Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-[#7b263e]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Select Role
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as StaffRole)
                }
                className="w-full border border-gray-300 rounded-xl p-3 bg-white"
              >
                <option value="manager">Manager</option>
                <option value="moderator">Moderator</option>
                <option value="full_admin">Full Admin</option>
              </select>
            </div>

            <button
              onClick={addStaff}
              disabled={sending}
              className="w-full bg-[#7b263e] text-white rounded-xl p-3 font-semibold disabled:opacity-50"
            >
              {sending ? "Sending Invitation..." : "+ Send Invitation"}
            </button>

            {message && (
              <p
                className={`text-sm p-3 rounded-xl ${
                  success
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </section>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-900">
          Only the Owner can invite staff and assign Full Admin roles.
          Staff invitations are handled securely by Supabase.
        </div>

      </div>
    </main>
  );
}
