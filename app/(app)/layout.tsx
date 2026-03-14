import { redirect } from "next/navigation"
import { Sidebar, Header } from "@/components/layout"
import { getWorkspaceFromAuth } from "@/lib/auth"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const workspace = await getWorkspaceFromAuth()

  if (!workspace) {
    redirect("/sign-in")
  }

  if (!workspace.onboardingDone) {
    redirect("/onboarding")
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--parchment)" }}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
      </div>
    </div>
  )
}
