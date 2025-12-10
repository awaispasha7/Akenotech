# EmailJS Setup Guide - Complete Instructions

## 🚀 Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Add Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Copy your Service ID** (you'll need this)

### Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

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

Message:
{{message}}

---
This message was sent from your website contact form.
Reply directly to: {{from_email}}
```

4. Set the "To Email" to: `Ask@akenotech.com`
5. **Copy your Template ID** (you'll need this)

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. **Copy your Public Key** (you'll need this)

### Step 5: Update Your Code
1. Open `tech/src/app/components/Contact.tsx`
2. Find these lines (around line 57-59):
```typescript
const serviceId = 'YOUR_SERVICE_ID';
const templateId = 'YOUR_TEMPLATE_ID';
const publicKey = 'YOUR_PUBLIC_KEY';
```

3. Replace with your actual values:
```typescript
const serviceId = 'service_xxxxxxxxx'; // Your actual service ID
const templateId = 'template_xxxxxxxxx'; // Your actual template ID
const publicKey = 'xxxxxxxxxxxxxxxx'; // Your actual public key
```

## ✅ That's It!

Your contact form will now:
- ✅ Send emails directly to `Ask@akenotech.com`
- ✅ Include all form data (name, email, company, message)
- ✅ Work without any backend server
- ✅ Work in production immediately

## 🧪 Testing

1. Start your development server: `npm run dev`
2. Go to your contact form
3. Fill out and submit the form
4. Check `Ask@akenotech.com` for the email

## 📧 Email Template Variables

The form sends these variables to your email template:
- `{{from_name}}` - User's name
- `{{from_email}}` - User's email
- `{{company}}` - User's company (or "Not provided")
- `{{message}}` - User's message
- `{{to_email}}` - Always "Ask@akenotech.com"

## 🎯 Benefits of EmailJS

- ✅ **No backend required** - Works directly from browser
- ✅ **Free tier available** - 200 emails/month free
- ✅ **Easy setup** - No server configuration needed
- ✅ **Works in production** - No deployment issues
- ✅ **Secure** - No credentials in your code
- ✅ **Reliable** - Professional email delivery

## 🔧 Troubleshooting

**If emails don't arrive:**
1. Check your spam folder
2. Verify the "To Email" in your template is `Ask@akenotech.com`
3. Make sure your service is properly connected
4. Check the browser console for errors

**If you get errors:**
1. Verify your Service ID, Template ID, and Public Key are correct
2. Make sure your email service is active
3. Check that your template has the correct variable names

## 📞 Support

If you need help:
1. Check EmailJS documentation: https://www.emailjs.com/docs/
2. EmailJS support: support@emailjs.com
3. Your contact form will work immediately once configured!

---

**Note:** The backend API route has been removed. Your contact form now uses EmailJS exclusively for sending emails.


