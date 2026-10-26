import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Demo requests. When HUBSPOT_PRIVATE_APP_TOKEN is set the requester is
 * created as a HubSpot contact; otherwise the request is accepted and logged.
 */

const DemoRequestSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(200),
  email: z.string().trim().email("Please enter a valid work email.").max(320),
  organization: z.string().trim().min(1, "Please enter your organization.").max(200),
  orgType: z.string().trim().min(1, "Please select an organization type.").max(100),
  sponsorsPerYear: z.string().trim().min(1, "Please select how many sponsors you work with.").max(50),
  message: z.string().trim().max(5000).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = DemoRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }
  const data = parsed.data;

  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) {
    console.info("[demo-request] received (HubSpot not configured):", data.email, "·", data.organization);
    return NextResponse.json({ crm: "none" });
  }

  const [firstname, ...rest] = data.name.split(/\s+/);
  const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      properties: { email: data.email, firstname, lastname: rest.join(" "), company: data.organization },
    }),
  });

  // 409 means the contact already exists — the request still reached the CRM.
  if (!res.ok && res.status !== 409) {
    console.error("[demo-request] HubSpot error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "We couldn't submit your request. Please try again shortly." }, { status: 502 });
  }
  return NextResponse.json({ crm: "hubspot" });
}
