import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function logAuditEvent(eventType: string, payload: Record<string, unknown>, ipAddress?: string, userAgent?: string) {
  await prisma.auditLog.create({
    data: {
      eventType,
      payload: payload as Prisma.InputJsonValue,
      ipAddress,
      userAgent,
    },
  })
}

export function generateReceiptNumber(): string {
  const date = new Date()
  const prefix = 'GF'
  const datePart = date.getFullYear().toString().slice(-2) +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${datePart}-${random}`
}
