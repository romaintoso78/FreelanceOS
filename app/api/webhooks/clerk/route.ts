import { headers } from "next/headers"
import { Webhook } from "svix"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils"

type ClerkUserCreatedEvent = {
  type: "user.created"
  data: {
    id: string
    email_addresses: Array<{ email_address: string }>
    first_name: string | null
    last_name: string | null
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 })
  }

  const headersList = await headers()
  const svix_id = headersList.get("svix-id")
  const svix_timestamp = headersList.get("svix-timestamp")
  const svix_signature = headersList.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  const body = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: ClerkUserCreatedEvent
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkUserCreatedEvent
  } catch {
    return new Response("Invalid signature", { status: 400 })
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data
    const email = email_addresses[0]?.email_address
    const name =
      [first_name, last_name].filter(Boolean).join(" ") || email?.split("@")[0] || "Mon Activité"

    const slug = generateSlug(name)

    // Create workspace for new user
    await prisma.workspace.upsert({
      where: { clerkUserId: id },
      create: {
        clerkUserId: id,
        name,
        slug,
        email: email ?? null,
      },
      update: {},
    })

    // Send welcome email (implement when email is configured)
    // await sendEmail({ to: email, subject: '...', react: <WelcomeEmail ... /> })
  }

  return new Response("OK", { status: 200 })
}
