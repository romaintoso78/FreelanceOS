import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components"
import { formatDateShort } from "@/lib/utils"

interface FiscalAlertEmailProps {
  userName: string
  eventTitle: string
  dueDate: Date
  daysLeft: number
  amount?: number
}

export function FiscalAlertEmail({
  userName,
  eventTitle,
  dueDate,
  daysLeft,
  amount,
}: FiscalAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Rappel fiscal — ${eventTitle} dans ${daysLeft} jours`}</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Heading style={{ color: "#d97706", fontSize: "24px" }}>
            Échéance fiscale dans {daysLeft} jours
          </Heading>
          <Text style={{ color: "#374151", fontSize: "16px" }}>
            Bonjour {userName},
          </Text>
          <Text style={{ color: "#374151", fontSize: "16px", lineHeight: "24px" }}>
            Un rappel : <strong>{eventTitle}</strong> est à régler avant le{" "}
            <strong>{formatDateShort(dueDate)}</strong>
            {amount !== undefined && ` (montant estimé : ${amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`}).
          </Text>
          <Text style={{ color: "#374151", fontSize: "14px" }}>
            Retrouvez toutes vos échéances fiscales dans votre tableau de bord FreelanceOS.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
