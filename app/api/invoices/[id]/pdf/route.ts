import { NextResponse } from "next/server"
import { getWorkspaceFromAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const workspace = await getWorkspaceFromAuth()

  if (!workspace) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id, workspaceId: workspace.id },
    include: {
      client: true,
      items: { orderBy: { position: "asc" } },
    },
  })

  if (!invoice) {
    return new NextResponse("Not found", { status: 404 })
  }

  // PDF generation with @react-pdf/renderer will be implemented here
  // For now, return a placeholder response
  // const pdfBuffer = await generateInvoicePdf({ invoice, workspace })
  // return new NextResponse(pdfBuffer, {
  //   headers: {
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': `attachment; filename="facture-${invoice.number}.pdf"`,
  //   },
  // })

  return new NextResponse(
    JSON.stringify({ message: "PDF generation coming soon", invoiceNumber: invoice.number }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  )
}
