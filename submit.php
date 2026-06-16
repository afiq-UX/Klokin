<?php
require_once __DIR__ . '/vendor/autoload.php';

use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;

// ── SMTP config — update to match your mail server ──────────────────────────
// Examples:
//   Gmail:    smtp://you@gmail.com:app_password@smtp.gmail.com:587
//   Mailgun:  smtp://postmaster@mg.yourdomain.com:key@smtp.mailgun.org:587
//   Generic:  smtp://user:password@mail.yourdomain.com:587
define('SMTP_DSN',    'smtp://user:password@mail.pocketpixel.com:587');
define('FROM_EMAIL',  'noreply@pocketpixel.com');
define('FROM_NAME',   'Klokin Website');
define('TO_EMAIL',    'office@pocketpixel.com');
define('CC_EMAILS',   ['adila@pocketpixel.com', 'marzuqi@pocketpixel.com']);
// ─────────────────────────────────────────────────────────────────────────────

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Honeypot — silently pass bots through
if (!empty($_POST['_gotcha'])) {
    echo json_encode(['ok' => true]);
    exit;
}

// Collect & sanitise
$name    = htmlspecialchars(trim($_POST['name']         ?? ''), ENT_QUOTES, 'UTF-8');
$email   = filter_var(trim($_POST['email']              ?? ''), FILTER_VALIDATE_EMAIL);
$org     = htmlspecialchars(trim($_POST['organisation'] ?? ''), ENT_QUOTES, 'UTF-8');
$size    = htmlspecialchars(trim($_POST['team_size']    ?? '—'), ENT_QUOTES, 'UTF-8');
$sector  = htmlspecialchars(trim($_POST['sector']       ?? '—'), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($_POST['message']      ?? '—'), ENT_QUOTES, 'UTF-8');

if (!$name || !$email || !$org) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Build email
$mail = (new Email())
    ->from(new Address(FROM_EMAIL, FROM_NAME))
    ->to(TO_EMAIL)
    ->cc(...CC_EMAILS)
    ->replyTo(new Address($email, $name))
    ->subject('Klokin Demo Request — ' . $org)
    ->text(implode("\n", [
        "Name:          $name",
        "Email:         $email",
        "Organisation:  $org",
        "Team size:     $size",
        "Sector:        $sector",
        "",
        "Message:",
        $message,
    ]))
    ->html("
        <p style='font-family:sans-serif;font-size:14px;color:#2a4a68'>
            New demo request from the Klokin website.
        </p>
        <table style='font-family:sans-serif;font-size:14px;border-collapse:collapse'>
            <tr><td style='padding:6px 16px 6px 0;color:#6b90b0;white-space:nowrap'>Name</td><td style='padding:6px 0'><strong>$name</strong></td></tr>
            <tr><td style='padding:6px 16px 6px 0;color:#6b90b0'>Email</td><td style='padding:6px 0'><a href='mailto:$email'>$email</a></td></tr>
            <tr><td style='padding:6px 16px 6px 0;color:#6b90b0'>Organisation</td><td style='padding:6px 0'>$org</td></tr>
            <tr><td style='padding:6px 16px 6px 0;color:#6b90b0'>Team size</td><td style='padding:6px 0'>$size</td></tr>
            <tr><td style='padding:6px 16px 6px 0;color:#6b90b0'>Sector</td><td style='padding:6px 0'>$sector</td></tr>
            <tr><td style='padding:6px 16px 6px 0;color:#6b90b0;vertical-align:top'>Message</td><td style='padding:6px 0'>" . nl2br($message) . "</td></tr>
        </table>
    ");

// Send
try {
    $transport = Transport::fromDsn(SMTP_DSN);
    $mailer    = new Mailer($transport);
    $mailer->send($mail);
    echo json_encode(['ok' => true]);
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send — ' . $e->getMessage()]);
}
