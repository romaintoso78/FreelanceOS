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

interface WelcomeEmailProps {
  name: string
  appUrl: string
}

export function WelcomeEmail({ name, appUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenue sur FreelanceOS — votre outil de gestion freelance</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Heading style={{ color: "#111827", fontSize: "24px" }}>
            Bienvenue sur FreelanceOS, {name} !
          </Heading>
          <Text style={{ color: "#6b7280", fontSize: "16px", lineHeight: "24px" }}>
            Votre compte est créé. Commencez par configurer votre profil freelance
            pour générer vos premières factures conformes à la loi française.
          </Text>
          <Section>
            <Button
              href={`${appUrl}/onboarding`}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Configurer mon profil
            </Button>
          </Section>
          <Text style={{ color: "#9ca3af", fontSize: "14px", marginTop: "24px" }}>
            FreelanceOS — Gestion simplifiée pour les freelances français
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
