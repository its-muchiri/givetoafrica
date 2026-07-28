import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { volunteerSchema, newsletterSchema } from '../lib/validation.js';
import { logAuditEvent } from '../lib/audit.js';
import { sendWelcomeEmail, sendNewsletterDigestEmail } from '../lib/email.js';
const router = Router();
const prisma = new PrismaClient();
// Submit volunteer application
router.post('/volunteer', async (req, res) => {
    try {
        const validation = volunteerSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Invalid input', details: validation.error.flatten() });
        }
        const { name, email, skills, availability } = validation.data;
        await logAuditEvent('volunteer_application', {
            name,
            email,
            skills: skills || '',
            availability: availability || '',
        }, req.ip, req.headers['user-agent']);
        // Send confirmation email
        try {
            await sendWelcomeEmail(email, name);
        }
        catch (emailError) {
            console.error('Failed to send volunteer confirmation email:', emailError);
        }
        res.json({ success: true, message: 'Application submitted successfully' });
    }
    catch (error) {
        console.error('Volunteer submission error:', error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});
// Subscribe to newsletter
router.post('/newsletter', async (req, res) => {
    try {
        const validation = newsletterSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Invalid input', details: validation.error.flatten() });
        }
        const { email } = validation.data;
        await logAuditEvent('newsletter_subscribe', { email }, req.ip, req.headers['user-agent']);
        // Send newsletter welcome email
        try {
            await sendNewsletterDigestEmail(email, 'Welcome to GiveToAfrica!', 'Thank you for subscribing to our newsletter. You will receive monthly updates on our impact, stories from the field, and ways to get involved.');
        }
        catch (emailError) {
            console.error('Failed to send newsletter welcome email:', emailError);
        }
        res.json({ success: true, message: 'Subscribed successfully' });
    }
    catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});
export { router as engagementRoutes };
