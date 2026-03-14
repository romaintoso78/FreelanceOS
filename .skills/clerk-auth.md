# Clerk Auth — FreelanceOS

## Setup

```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs"
export default function RootLayout({ children }) {
  return <ClerkProvider>{children}</ClerkProvider>
}
```

## Middleware

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/", "/pricing", "/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const { userId } = await auth()
    if (!userId) return redirect("/sign-in")
  }
})
```

## Récupérer l'utilisateur côté serveur

```typescript
import { auth } from "@clerk/nextjs/server"

const { userId } = await auth()
```

## Pages auth (catch-all routes)

```
app/(auth)/sign-in/[[...sign-in]]/page.tsx  → <SignIn />
app/(auth)/sign-up/[[...sign-up]]/page.tsx  → <SignUp />
```

## Variables d'env requises

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## Webhook user.created

Configurer dans le dashboard Clerk → Webhooks → ajouter l'endpoint.
Vérifier la signature avec `svix`.

## Composants UI

```tsx
import { UserButton } from "@clerk/nextjs"
<UserButton afterSignOutUrl="/" />
```
