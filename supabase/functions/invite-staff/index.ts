
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://cats-world-store.vercel.app",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OWNER_ID = "d6d7f71f-92e7-4caa-a3cb-b09c9590b70a";

const INVITE_REDIRECT =
  "https://cats-world-store.vercel.app/admin/accept-invite";

function respond(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

// Supports the new Supabase JSON key dictionaries
// and older plain-text environment variables.
function getDefaultKey(raw: string | undefined): string | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (typeof parsed === "string") {
      return parsed;
    }

    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.default === "string"
    ) {
      return parsed.default;
    }

    return null;
  } catch {
    return raw;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return respond({ error: "Method not allowed." }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return respond({ error: "Unauthorized." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");

    const anonKey =
      getDefaultKey(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS")) ??
      Deno.env.get("SUPABASE_ANON_KEY");

    const serviceRoleKey =
      getDefaultKey(Deno.env.get("SUPABASE_SECRET_KEYS")) ??
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      console.error("Supabase URL or required API key is missing.");
      return respond(
        { error: "Required Supabase keys are missing." },
        500
      );
    }

    const authClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user: owner },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !owner) {
      return respond({ error: "Invalid login session." }, 401);
    }

    if (owner.id !== OWNER_ID) {
      return respond(
        { error: "Only the store owner can invite staff." },
        403
      );
    }

    let body: { email?: unknown; role?: unknown };

    try {
      body = await req.json();
    } catch {
      return respond({ error: "Invalid request body." }, 400);
    }

    if (!body || typeof body !== "object") {
      return respond({ error: "Invalid request body." }, 400);
    }

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const role = body.role;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return respond(
        { error: "Please enter a valid email address." },
        400
      );
    }

    if (
      !["full_admin", "manager", "moderator"].includes(
        typeof role === "string" ? role : ""
      )
    ) {
      return respond({ error: "Invalid staff role." }, 400);
    }
    
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: invitation, error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: INVITE_REDIRECT,
      });

    if (inviteError || !invitation?.user) {
      console.error("Staff invitation failed:", inviteError);

      return respond(
        {
          error: inviteError?.message || "Invitation failed.",
        },
        400
      );
    }

    const { error: insertError } = await adminClient
      .from("staff_roles")
      .insert({
        user_id: invitation.user.id,
        role,
        created_by: owner.id,
      });

    if (insertError) {
      console.error("Staff role insert failed:", insertError);

      const { error: deleteError } =
        await adminClient.auth.admin.deleteUser(
          invitation.user.id
        );

      if (deleteError) {
        console.error("Invitation rollback failed:", deleteError);
      }

      return respond(
        {
          error:
            insertError.message || "Could not save staff role.",
        },
        400
      );
    }

    return respond({
      success: true,
      message: "Staff invitation sent successfully.",
      email,
      role,
    });
  } catch (error) {
    console.error("Invite staff function error:", error);

    return respond(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected server error occurred.",
      },
      500
    );
  }
});
          
