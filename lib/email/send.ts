import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.FROM_EMAIL ?? "noreply@freelanceos.fr"

interface SendEmailOptions {
  to: string | string[]
  subject: string
  react: React.ReactElement
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType: string
  }>
}

export async function sendEmail({ to, subject, react, attachments }: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    react,
    attachments,
  })

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`)
  }

  return data
}
