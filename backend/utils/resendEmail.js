const { Resend } = require('resend');

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is missing in server environment');
  }
  return new Resend(apiKey);
}

function getFromAddress() {
  const from = process.env.RESEND_FROM;
  console.log('Using RESEND_FROM address:', from);
  if (!from) {
    // Force explicit config so this doesn't silently fail in production.
    throw new Error('RESEND_FROM is missing in server environment');
  }
  return from;
}

async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const resend = getResendClient();

  const safeName = typeof name === 'string' && name.trim().length ? name.trim() : 'there';
  const subject = 'Reset your password';

  const text = [
    `Hi ${safeName},`,
    '',
    'We received a request to reset your password.',
    `Reset it here: ${resetUrl}`,
    '',
    'If you did not request this, you can ignore this email.',
  ].join('\n');

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.5;">
      <p>Hi ${escapeHtml(safeName)},</p>
      <p>We received a request to reset your password.</p>
      <p>
        <a href="${escapeAttribute(resetUrl)}" style="display:inline-block;padding:10px 14px;background:#111827;color:#fff;border-radius:8px;text-decoration:none;">
          Reset password
        </a>
      </p>
      <p style="color:#374151;font-size:14px;">Or copy and paste this URL into your browser:</p>
      <p style="color:#111827;font-size:14px;word-break:break-all;">${escapeHtml(resetUrl)}</p>
      <p style="color:#6b7280;font-size:13px;">If you did not request this, you can ignore this email.</p>
    </div>
  `.trim();

  const result = await resend.emails.send({
    from: getFromAddress(),
    to,
    subject,
    text,
    html,
  });

  console.log('Resend email send result:', {
    to,
    subject,
    status: result?.status || 'unknown',
    messageId: result?.id || result?.messageId || null,
  });

  return result;
}

function escapeHtml(input) {
  return String(input)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttribute(input) {
  // Basic attribute escaping (sufficient for href here).
  return escapeHtml(input).replaceAll('`', '&#096;');
}

module.exports = {
  sendPasswordResetEmail,
};

