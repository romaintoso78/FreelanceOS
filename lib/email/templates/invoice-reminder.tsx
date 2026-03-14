import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components"
import { formatAmount, formatDateShort } from "@/lib/utils"

interface InvoiceReminderEmailProps {
  clientName: string
  invoiceNumber: string
  amount: number
  dueDate: Date
  daysOverdue: number
  pdfUrl: string
  senderName: string
}

export function InvoiceReminderEmail({
  clientName,
  invoiceNumber,
  amount,
  dueDate,
  daysOverdue,
  pdfUrl,
  senderName,
}: InvoiceReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Rappel — Facture {invoiceNumber} en attente de règlement
      </Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Heading style={{ color: "#dc2626", fontSize: "24px" }}>
            Rappel de paiement
          </Heading>
          <Text style={{ color: "#374151", fontSize: "16px" }}>
            Bonjour {clientName},
          </Text>
          <Text style={{ color: "#374151", fontSize: "16px", lineHeight: "24px" }}>
            Sauf erreur de notre part, la facture <strong>{invoiceNumber}</strong> d&apos;un
            montant de <strong>{formatAmount(amount)}</strong> TTC, dont l&apos;échéance était
            le <strong>{formatDateShort(dueDate)}</strong>, reste impayée à ce jour
            ({daysOverdue} jour{daysOverdue > 1 ? "s" : ""} de retard).
          </Text>
          <Text style={{ color: "#374151", fontSize: "16px" }}>
            Nous vous remercions de bien vouloir procéder au règlement dans les
            meilleurs délais.
          </Text>
          <Button
            href={pdfUrl}
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Voir la facture
          </Button>
          <Text style={{ color: "#374151", fontSize: "14px", marginTop: "24px" }}>
            Cordialement,
            <br />
            {senderName}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
