-- CreateEnum
CREATE TYPE "LegalStatus" AS ENUM ('AUTO_ENTREPRENEUR', 'SASU', 'EURL');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('STARTER', 'PRO', 'EXPERT');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('PROSPECT', 'IN_PROGRESS', 'COMPLETED', 'LOST');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'SENT', 'SIGNED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FiscalEventType" AS ENUM ('URSSAF', 'TVA', 'IS', 'CFE', 'OTHER');

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "legalStatus" "LegalStatus" NOT NULL DEFAULT 'AUTO_ENTREPRENEUR',
    "siret" TEXT,
    "vatNumber" TEXT,
    "address" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'FR',
    "email" TEXT,
    "phone" TEXT,
    "logoUrl" TEXT,
    "stripeCustomerId" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'STARTER',
    "planExpiresAt" TIMESTAMP(3),
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'FR',
    "siret" TEXT,
    "vatNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "MissionStatus" NOT NULL DEFAULT 'PROSPECT',
    "dailyRate" DECIMAL(10,2),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "missionId" TEXT,
    "number" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "vatExempt" BOOLEAN NOT NULL DEFAULT false,
    "subtotalHT" DECIMAL(10,2) NOT NULL,
    "vatAmount" DECIMAL(10,2) NOT NULL,
    "totalTTC" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "pdfUrl" TEXT,
    "sentAt" TIMESTAMP(3),
    "viewedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "avoirReference" TEXT,
    "reminderSentAt" TIMESTAMP(3)[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "vatRate" DECIMAL(5,2) NOT NULL,
    "totalHT" DECIMAL(10,2) NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "subtotalHT" DECIMAL(10,2) NOT NULL,
    "vatAmount" DECIMAL(10,2) NOT NULL,
    "totalTTC" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "pdfUrl" TEXT,
    "sentAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteItem" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "vatRate" DECIMAL(5,2) NOT NULL,
    "totalHT" DECIMAL(10,2) NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "QuoteItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractTemplate" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ContractTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "templateId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "signatureToken" TEXT,
    "signedAt" TIMESTAMP(3),
    "signerName" TEXT,
    "signerEmail" TEXT,
    "signerIp" TEXT,
    "expiresAt" TIMESTAMP(3),
    "fileUrl" TEXT,
    "sentAt" TIMESTAMP(3),
    "alertSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "missionId" TEXT,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "vatAmount" DECIMAL(10,2),
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeEntry" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "description" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "stoppedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiscalEvent" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "type" "FiscalEventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(10,2),
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "alertSentAt" TIMESTAMP(3),
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FiscalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_clerkUserId_key" ON "Workspace"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_stripeCustomerId_key" ON "Workspace"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "Workspace_clerkUserId_idx" ON "Workspace"("clerkUserId");

-- CreateIndex
CREATE INDEX "Workspace_slug_idx" ON "Workspace"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_workspaceId_idx" ON "Subscription"("workspaceId");

-- CreateIndex
CREATE INDEX "Client_workspaceId_idx" ON "Client"("workspaceId");

-- CreateIndex
CREATE INDEX "Client_workspaceId_createdAt_idx" ON "Client"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "Client_workspaceId_deletedAt_idx" ON "Client"("workspaceId", "deletedAt");

-- CreateIndex
CREATE INDEX "Mission_workspaceId_idx" ON "Mission"("workspaceId");

-- CreateIndex
CREATE INDEX "Mission_workspaceId_status_idx" ON "Mission"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "Mission_workspaceId_clientId_idx" ON "Mission"("workspaceId", "clientId");

-- CreateIndex
CREATE INDEX "Invoice_workspaceId_idx" ON "Invoice"("workspaceId");

-- CreateIndex
CREATE INDEX "Invoice_workspaceId_status_idx" ON "Invoice"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "Invoice_workspaceId_issueDate_idx" ON "Invoice"("workspaceId", "issueDate");

-- CreateIndex
CREATE INDEX "Invoice_workspaceId_dueDate_idx" ON "Invoice"("workspaceId", "dueDate");

-- CreateIndex
CREATE INDEX "Invoice_clientId_idx" ON "Invoice"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_workspaceId_number_key" ON "Invoice"("workspaceId", "number");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");

-- CreateIndex
CREATE INDEX "Quote_workspaceId_idx" ON "Quote"("workspaceId");

-- CreateIndex
CREATE INDEX "Quote_workspaceId_status_idx" ON "Quote"("workspaceId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_workspaceId_number_key" ON "Quote"("workspaceId", "number");

-- CreateIndex
CREATE INDEX "QuoteItem_quoteId_idx" ON "QuoteItem"("quoteId");

-- CreateIndex
CREATE INDEX "ContractTemplate_workspaceId_idx" ON "ContractTemplate"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_signatureToken_key" ON "Contract"("signatureToken");

-- CreateIndex
CREATE INDEX "Contract_workspaceId_idx" ON "Contract"("workspaceId");

-- CreateIndex
CREATE INDEX "Contract_workspaceId_status_idx" ON "Contract"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "Contract_clientId_idx" ON "Contract"("clientId");

-- CreateIndex
CREATE INDEX "Contract_signatureToken_idx" ON "Contract"("signatureToken");

-- CreateIndex
CREATE INDEX "Expense_workspaceId_idx" ON "Expense"("workspaceId");

-- CreateIndex
CREATE INDEX "Expense_workspaceId_date_idx" ON "Expense"("workspaceId", "date");

-- CreateIndex
CREATE INDEX "Expense_workspaceId_category_idx" ON "Expense"("workspaceId", "category");

-- CreateIndex
CREATE INDEX "TimeEntry_workspaceId_idx" ON "TimeEntry"("workspaceId");

-- CreateIndex
CREATE INDEX "TimeEntry_missionId_idx" ON "TimeEntry"("missionId");

-- CreateIndex
CREATE INDEX "TimeEntry_workspaceId_startedAt_idx" ON "TimeEntry"("workspaceId", "startedAt");

-- CreateIndex
CREATE INDEX "FiscalEvent_workspaceId_idx" ON "FiscalEvent"("workspaceId");

-- CreateIndex
CREATE INDEX "FiscalEvent_workspaceId_dueDate_idx" ON "FiscalEvent"("workspaceId", "dueDate");

-- CreateIndex
CREATE INDEX "FiscalEvent_workspaceId_isPaid_idx" ON "FiscalEvent"("workspaceId", "isPaid");

-- CreateIndex
CREATE INDEX "Notification_workspaceId_idx" ON "Notification"("workspaceId");

-- CreateIndex
CREATE INDEX "Notification_workspaceId_isRead_idx" ON "Notification"("workspaceId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_workspaceId_createdAt_idx" ON "Notification"("workspaceId", "createdAt");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractTemplate" ADD CONSTRAINT "ContractTemplate_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ContractTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalEvent" ADD CONSTRAINT "FiscalEvent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
