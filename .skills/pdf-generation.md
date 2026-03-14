# PDF Generation — FreelanceOS (@react-pdf/renderer)

## Pourquoi @react-pdf/renderer

- Fonctionne nativement sur Vercel Serverless
- API JSX familière
- Pas de dépendance Chrome/headless

## Template de base

```typescript
// lib/pdf/invoice-template.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
})

export function InvoicePdf({ invoice, workspace }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>{workspace.name}</Text>
          <Text>Facture {invoice.number}</Text>
        </View>
        {/* ... */}
      </Page>
    </Document>
  )
}
```

## Génération dans l'API Route

```typescript
// app/api/invoices/[id]/pdf/route.ts
import { renderToBuffer } from "@react-pdf/renderer"

const pdfBuffer = await renderToBuffer(<InvoicePdf invoice={invoice} workspace={workspace} />)
return new Response(pdfBuffer, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="facture-${invoice.number}.pdf"`,
  },
})
```

## Limitations @react-pdf

- Subset CSS limité (pas de Flexbox avancé, pas de Grid)
- Pas de HTML → PDF direct
- Police par défaut : Helvetica (pas de custom fonts sans config)
- Pas de support image SVG natif (utiliser PNG)
