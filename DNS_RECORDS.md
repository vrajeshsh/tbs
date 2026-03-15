# Resend DNS Records

Add the following DNS records in your domain provider to enable email sending and receiving via Resend.

## 1. Domain Verification & DKIM
- **Type**: TXT
- **Name**: `resend._domainkey`
- **Value**: `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDx0qAdxp3s32Qvlp3c9F58SxxUcg6y9XiX+18Cajaq4MX5vNf7X444HyPEQJCm1ZO5qGImUjbPTGSjO3MyWkcvuWwrTdAsCVw5laKo+RjsGQ0G3z+uiYex/WWtxDlX4HqaJozlMludzHvVSD00iWax2X7Nq0yLClMIvf21C8YPqwIDAQAB`
- **TTL**: Auto

## 2. SPF (Sender Policy Framework)
- **Type**: TXT
- **Name**: `send`
- **Value**: `v=spf1 include:amazonses.com ~all`
- **TTL**: Auto

## 3. MX (Mail Exchange) - Sending
- **Type**: MX
- **Name**: `send`
- **Value**: `feedback-smtp.us-east-1.amazonses.com`
- **TTL**: Auto
- **Priority**: 10

## 4. DMARC (Optional but Recommended)
- **Type**: TXT
- **Name**: `_dmarc`
- **Value**: `v=DMARC1; p=none;`
- **TTL**: Auto

## 5. MX - Receiving
- **Type**: MX
- **Name**: `@`
- **Value**: `inbound-smtp.us-east-1.amazonaws.com`
- **TTL**: Auto
- **Priority**: 10
