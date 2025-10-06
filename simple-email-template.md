# Simple EmailJS Template - Text Format

## Template Settings:

**Template Name:** Contact Us
**Template ID:** template_uujhwhn

## Email Configuration:

**To Email:** ask@akenotech.com
**From Email:** ask@akenotech.com
**From Name:** Akeno Tech Website
**Reply To:** {{from_email}}

## Subject Line:
```
New Contact Form Submission from {{from_name}}
```

## Email Content (Plain Text):
```
Hello,

You have received a new contact form submission from your Akeno Tech website.

Contact Details:
Name: {{from_name}}
Email: {{from_email}}
Company: {{company}}

Message:
{{message}}

---
This email was sent from your website contact form.
Reply directly to: {{from_email}}
```

## Email Content (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
    
    <p>You have received a new contact form submission from your Akeno Tech website.</p>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Contact Details:</h3>
        <p><strong>Name:</strong> {{from_name}}</p>
        <p><strong>Email:</strong> {{from_email}}</p>
        <p><strong>Company:</strong> {{company}}</p>
    </div>
    
    <div style="background: white; padding: 15px; border: 1px solid #e9ecef; border-radius: 5px;">
        <h3 style="color: #495057; margin-top: 0;">Message:</h3>
        <p>{{message}}</p>
    </div>
    
    <div style="margin-top: 20px; padding: 10px; background: #e9ecef; border-radius: 4px; font-size: 14px; color: #6c757d;">
        <p style="margin: 0;">This email was sent from your Akeno Tech website contact form.</p>
        <p style="margin: 5px 0 0 0;">Reply directly to: {{from_email}}</p>
    </div>
    
</body>
</html>
```

## How to Use:

1. **Go to EmailJS Dashboard**
2. **Edit Template `template_uujhwhn`**
3. **Copy the content above**
4. **Paste into your EmailJS template**
5. **Make sure "From Email" is set to `ask@akenotech.com`**
6. **Save the template**

## Key Points:

- ✅ Simple, clean design
- ✅ No spammy keywords
- ✅ Professional formatting
- ✅ Clear contact information
- ✅ Proper sender authentication
- ✅ Both HTML and plain text versions
