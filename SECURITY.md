# Security Policy — ZYRO Electric

## Supported Versions

The following versions of ZYRO Electric currently receive security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | ✅ Active support  |
| < 1.0   | ❌ Not supported   |

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

Instead, report security issues directly to the we3ds-solution team:

📧 **Email:** `we3ds.solution@gmail.com`  
🔒 **Subject line:** `[SECURITY] ZYRO-Electric — <brief description>`

### What to Include

- A clear description of the vulnerability
- Steps to reproduce (proof of concept if possible)
- The potential impact (data exposure, auth bypass, etc.)
- Your suggested fix (optional)
- Your GitHub username (for credit in the advisory)

### Response Timeline

| Stage | Timeline |
|---|---|
| Acknowledgement | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix or mitigation | Within 30 days (critical: 7 days) |
| Public disclosure | After patch is released |

### Scope

In scope for security reports:
- Authentication / authorization bypass
- Injection vulnerabilities (SQL, XSS, CSRF)
- Sensitive data exposure
- Broken access control
- Security misconfiguration in Docker/Nginx

Out of scope:
- Vulnerabilities in third-party dependencies already tracked by `npm audit` or Dependabot
- Issues requiring physical access to a server
- Theoretical vulnerabilities without a working proof of concept

## Security Practices

- Dependencies are scanned weekly by Dependabot (`.github/dependabot.yml`)
- GitHub Actions secrets are used for all credentials — no hardcoded keys
- CORS and JWT configurations are validated on every PR

---

Thank you for helping keep ZYRO Electric secure. ⚡
