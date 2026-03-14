import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import { formatAmount, formatDateShort } from "@/lib/utils"

interface InvoiceSentEmailProps {
  clientName: string
  invoiceNumber: string
  amount: number
  dueDate: Date
  pdfUrl: string
  senderName: string
}

export function InvoiceSentEmail({
  clientName,
  invoiceNumber,
  amount,
  dueDate,
  pdfUrl,
  senderName,
}: InvoiceSentEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Facture {invoiceNumber} — {formatAmount(amount)}
      </Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Heading style={{ color: "#111827", fontSize: "24px" }}>
            Facture {invoiceNumber}
          </Heading>
          <Text style={{ color: "#374151", fontSize: "16px" }}>
            Bonjour {clientName},
          </Text>
          <Text style={{ color: "#374151", fontSize: "16px", lineHeight: "24px" }}>
            Veuillez trouver ci-joint la facture <strong>{invoiceNumber}</strong> d&apos;un montant
            de <strong>{formatAmount(amount)}</strong> TTC, à régler avant le{" "}
            <strong>{formatDateShort(dueDate)}</strong>.
          </Text>
          <Section>
            <Button
              href={pdfUrl}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Télécharger la facture
            </Button>
          </Section>
          <Text style={{ color: "#374151", fontSize: "14px", marginTop: "24px" }}>
            Cordialement,
            <br />
            {senderName}
          </Text>
          <Text style={{ color: "#9ca3af", fontSize: "12px", marginTop: "16px" }}>
            En cas de retard de paiement, des pénalités de retard au taux de 3 fois le taux
            d&apos;intérêt légal seront appliquées, ainsi qu&apos;une indemnité forfaitaire de
            recouvrement de 40 €.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
