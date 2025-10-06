# EmailJS Template Test Configuration

## Current Template Settings:
- **Template ID:** `template_uujhwhn`
- **Service ID:** `service_4yz4k76`

## Template Content to Use:

**Subject:**
```
New Contact Form Submission from {{from_name}}
```

**Content:**
```
New Contact Form Submission

Name: {{from_name}}
Email: {{from_email}}
Company: {{company}}
Message: {{message}}

---
This message was sent from your website contact form.
Reply directly to: {{from_email}}
```

**Important Settings:**
- **To Email:** `ask@akenotech.com`
- **From Name:** `Akeno Tech Website`
- **Reply To:** `{{from_email}}`

## Test Steps:
1. Go to EmailJS Dashboard
2. Edit template `template_uujhwhn`
3. Use the content above
4. Make sure "To Email" is exactly: `ask@akenotech.com`
5. Save and test
