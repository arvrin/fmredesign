/**
 * Inngest Functions: Email Sending
 * Durably sends emails via Resend with throttling.
 */

import { inngest } from '../client';
import { getResend } from '@/lib/email/resend';

const FROM = 'FreakingMinds <notifications@freakingminds.in>';

export const sendEmailFn = inngest.createFunction(
  {
    id: 'send-email',
    retries: 5,
    throttle: { limit: 10, period: '1s' },
  },
  { event: 'email/send' },
  async ({ event, step }) => {
    const { to, subject, html } = event.data;

    await step.run('send-via-resend', async () => {
      const resend = getResend();
      if (!resend) {
        // No Resend key configured — skip silently
        return;
      }
      const { error } = await resend.emails.send({
        from: FROM,
        to,
        subject,
        html,
      });
      if (error) {
        throw new Error(`Resend email failed: ${error.message}`);
      }
    });

    return { success: true };
  }
);

export const sendEmailTemplateFn = inngest.createFunction(
  { id: 'send-email-template', retries: 3 },
  { event: 'email/send-template' },
  async ({ event, step }) => {
    const { template, templateData, to } = event.data;

    // Step 1: Render template (survives send retries)
    const rendered = await step.run('render-template', async () => {
      // Dynamic import of send.ts template functions
      const templates = await import('@/lib/email/send');
      const templateFn = (templates as unknown as Record<string, unknown>)[template];
      if (!templateFn || typeof templateFn !== 'function') {
        throw new Error(`Email template "${template}" not found`);
      }
      return (templateFn as (data: Record<string, unknown>) => { subject: string; html: string })(templateData);
    });

    // Step 2: Send the rendered email
    await step.run('send-rendered-email', async () => {
      const resend = getResend();
      if (!resend) return;

      const FALLBACK_EMAIL = 'freakingmindsdigital@gmail.com';
      const recipient = to || process.env.NOTIFICATION_EMAIL || FALLBACK_EMAIL;

      const { error } = await resend.emails.send({
        from: FROM,
        to: recipient,
        subject: rendered.subject,
        html: rendered.html,
      });
      if (error) {
        throw new Error(`Resend email failed: ${error.message}`);
      }
    });

    return { success: true };
  }
);
