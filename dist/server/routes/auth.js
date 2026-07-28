import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { loginSchema } from '../lib/validation.js';
import { sendMagicLinkEmail } from '../lib/email.js';
import crypto from 'crypto';
const router = Router();
const prisma = new PrismaClient();
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || '').split(',').map((e) => e.trim()).filter(Boolean);
// Request magic link (donor portal)
router.post('/magic-link', async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        const { email } = validation.data;
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        // Invalidate old tokens
        await prisma.magicLink.updateMany({
            where: { email, used: false },
            data: { used: true },
        });
        // Create new token
        await prisma.magicLink.create({
            data: { email, token, expiresAt },
        });
        await sendMagicLinkEmail(email, token);
        res.json({ message: 'Magic link sent to your email' });
    }
    catch (error) {
        console.error('Magic link error:', error);
        res.status(500).json({ error: 'Failed to send magic link' });
    }
});
// Request admin magic link (restricted to admin emails)
router.post('/admin/magic-link', async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        const { email } = validation.data;
        // Only allow configured admin emails
        if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(email)) {
            // Return success even if email not in list (don't reveal admin emails)
            return res.json({ message: 'If an account exists, a magic link has been sent.' });
        }
        // Check if admin user exists
        const adminUser = await prisma.adminUser.findUnique({ where: { email } });
        if (!adminUser && ADMIN_EMAILS.length > 0) {
            // Auto-create admin user for configured emails
            await prisma.adminUser.create({
                data: { email, name: email.split('@')[0], role: 'admin' },
            });
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await prisma.magicLink.updateMany({
            where: { email, used: false },
            data: { used: true },
        });
        await prisma.magicLink.create({
            data: { email, token, expiresAt },
        });
        await sendMagicLinkEmail(email, token);
        res.json({ message: 'If an account exists, a magic link has been sent.' });
    }
    catch (error) {
        console.error('Admin magic link error:', error);
        res.status(500).json({ error: 'Failed to send magic link' });
    }
});
// Verify magic link (works for both donor and admin)
router.get('/verify', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token || typeof token !== 'string') {
            return res.status(400).json({ error: 'Invalid token' });
        }
        const magicLink = await prisma.magicLink.findUnique({
            where: { token },
        });
        if (!magicLink || magicLink.used || magicLink.expiresAt < new Date()) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        // Mark token as used
        await prisma.magicLink.update({
            where: { id: magicLink.id },
            data: { used: true },
        });
        // Check if this is an admin email
        const isAdmin = ADMIN_EMAILS.includes(magicLink.email);
        if (isAdmin) {
            // Find or create admin user
            let adminUser = await prisma.adminUser.findUnique({ where: { email: magicLink.email } });
            if (!adminUser) {
                adminUser = await prisma.adminUser.create({
                    data: { email: magicLink.email, name: magicLink.email.split('@')[0], role: 'admin' },
                });
            }
            // Update last login
            await prisma.adminUser.update({
                where: { id: adminUser.id },
                data: { lastLogin: new Date() },
            });
            const sessionToken = crypto.randomBytes(32).toString('hex');
            return res.json({
                sessionToken,
                role: 'admin',
                user: {
                    id: adminUser.id,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: adminUser.role,
                },
            });
        }
        // Regular donor flow
        let donor = await prisma.donor.findUnique({ where: { email: magicLink.email } });
        if (!donor) {
            return res.status(404).json({ error: 'No account found with this email' });
        }
        const sessionToken = crypto.randomBytes(32).toString('hex');
        res.json({
            sessionToken,
            role: 'donor',
            user: {
                id: donor.id,
                name: donor.name,
                email: donor.email,
            },
        });
    }
    catch (error) {
        console.error('Magic link verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});
export { router as authRoutes };
