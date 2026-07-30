import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
router.get('/prisma-deploy', async (_req, res) => {
    try {
        await prisma.$executeRaw `CREATE UNIQUE INDEX IF NOT EXISTS "donations_providerTransactionId_key" ON "donations"("providerTransactionId") WHERE "providerTransactionId" IS NOT NULL`;
        res.send('Migration applied successfully');
    }
    catch (e) {
        res.status(500).send(String(e));
    }
    finally {
        await prisma.$disconnect();
    }
});
export default router;
