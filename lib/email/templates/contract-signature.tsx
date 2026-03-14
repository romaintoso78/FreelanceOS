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

interface ContractSignatureEmailProps {
  clientName: string
  contractTitle: string
  signatureUrl: string
  senderName: string
  expiresAt?: Date
}

export function ContractSignatureEmail({
  clientName,
  contractTitle,
  signatureUrl,
  senderName,
  expiresAt,
}: ContractSignatureEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Signature requise — {contractTitle}</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Heading style={{ color: "#111827", fontSize: "24px" }}>
            Signature de contrat requise
          </Heading>
          <Text style={{ color: "#374151", fontSize: "16px" }}>
            Bonjour {clientName},
          </Text>
          <Text style={{ color: "#374151", fontSize: "16px", lineHeight: "24px" }}>
            {senderName} vous demande de signer le contrat :{" "}
            <strong>«&nbsp;{contractTitle}&nbsp;»</strong>.
          </Text>
          {expiresAt && (
            <Text style={{ color: "#6b7280", fontSize: "14px" }}>
              Ce lien de signature expire le{" "}
              {expiresAt.toLocaleDateString("fr-FR")}.
            </Text>
          )}
          <Button
            href={signatureUrl}
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Lire et signer le contrat
          </Button>
          <Text style={{ color: "#9ca3af", fontSize: "12px", marginTop: "24px" }}>
            Ce lien de signature est à usage unique et personnel. Ne le partagez pas.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
