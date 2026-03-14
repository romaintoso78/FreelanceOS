# React Email + Resend — FreelanceOS

## Structure

```
lib/email/
  send.ts            ← wrapper Resend
  templates/
    welcome.tsx
    invoice-sent.tsx
    invoice-reminder.tsx
    contract-signature.tsx
    fiscal-alert.tsx
```

## Envoyer un email

```typescript
import { sendEmail } from "@/lib/email/send"
import { InvoiceSentEmail } from "@/lib/email/templates/invoice-sent"

await sendEmail({
  to: client.email,
  subject: `Facture ${invoice.number}`,
  react: <InvoiceSentEmail
    clientName={client.name}
    invoiceNumber={invoice.number}
    amount={Number(invoice.totalTTC)}
    dueDate={invoice.dueDate}
    pdfUrl={invoice.pdfUrl!}
    senderName={workspace.name}
  />,
  attachments: [{
    filename: `facture-${invoice.number}.pdf`,
    content: pdfBuffer,
    contentType: "application/pdf",
  }],
})
```

## Template minimal

```tsx
import { Html, Head, Body, Container, Text, Button, Preview } from "@react-email/components"

export function MyEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>Objet de l&apos;email (affiché dans la liste)</Preview>
      <Body>
        <Container>
          <Text>Bonjour {name}</Text>
          <Button href="https://...">CTA</Button>
        </Container>
      </Body>
    </Html>
  )
}
```

## Toujours envoyer depuis

```
FROM_EMAIL=noreply@freelanceos.fr
```
