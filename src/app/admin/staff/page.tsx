
"use client";

import { useState } from "react";

type StaffRole = "full_admin" | "manager" | "moderator";

type Staff = {
  id: string;
  email: string;
  role: StaffRole;
};

export default function StaffManagementPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("manager");
  const [staff, setStaff] = useState<Staff[]>([]);
  const [message, setMessage] = useState("");

  const addStaff = () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setMessage("Please enter a valid Gmail address.");
      return;
    }

    if (!cleanEmail.endsWith("@gmail.com")) {
      setMessage("Please use a Gmail address.");
      return;
    }

    if (staff.some((item) => item.email === cleanEmail)) {
      setMessage("This staff member is already added.");
      return;
    }

    setStaff((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        email: cleanEmail,
        role,
      },
    ]);

    setEmail("");
    setMessage("Staff added to this temporary list.");
  };

  const removeStaff = (id: string) => {
    setStaff((previous) => previous.filter((item) => item.id !== id));
    setMessage("Staff removed from this temporary list.");
  };

  const roleName = (value: StaffRole) => {
    const names = {
      full_admin: "Full Admin",
      manager: "Manager",
      moderator: "Moderator",
    };

    return names[value];
  };

  return (
    <main className="min-h-screen bg-[#f8f3ed] p-4 md:p-8 text-[#3b1822]">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <a
            href="/admin/dashboard"
            className="text-sm text-[#7b263e] underline"
          >
            ← Back to Dashboard
          </a>

          <h1 className="text-3xl font-bold mt-4">
            Staff Management
          </h1>

          <p className="text-gray-600 mt-2">
            Manage your Cat's World team members and permissions.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-5">
            Add New Staff
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
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="w-full border border-gray-300 rounded-xl p-3 bg-white"
              >
                <option value="full_admin">Full Admin</option>
                <option value="manager">Manager</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>

            <button
              onClick={addStaff}
              className="w-full bg-[#7b263e] text-white rounded-xl p-3 font-semibold hover:bg-[#5d1b2e]"
            >
              + Add Staff
            </button>

            {message && (
              <p className="text-sm text-[#7b263e]">
                {message}
              </p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-5">
            Staff Members ({staff.length})
          </h2>

          {staff.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No staff members added yet.
            </div>
          ) : (
            <div className="space-y-3">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold break-all">
                      {member.email}
                    </p>

                    <span className="inline-block mt-2 text-xs bg-[#f5e6ea] text-[#7b263e] px-3 py-1 rounded-full">
                      {roleName(member.role)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeStaff(member.id)}
                    className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-900">
          Important: This is currently a visual demo.
          Staff entries are temporary and disappear after refresh.
          No invitations, database changes, or real permissions are active yet.
        </div>

      </div>
    </main>
  );
                }
