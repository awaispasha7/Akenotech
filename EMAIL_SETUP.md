# Email Setup Instructions

To make the contact form work and send emails to `Ask@akenotech.com`, follow these steps:

## 1. Create Environment File

Create a file named `.env.local` in the `tech` folder with the following content:

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
```

## 2. Gmail Setup

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password
1. In Google Account settings, go to Security
2. Under "2-Step Verification", click "App passwords"
3. Select "Mail" and "Other (custom name)"
4. Enter "Akeno Tech Website" as the name
5. Copy the generated 16-character password

### Step 3: Update Environment File
Replace the values in `.env.local`:
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: The 16-character app password (not your regular password)

## 3. Email Configuration

The system is configured to:
- Send emails FROM: Your Gmail address
- Send emails TO: `Ask@akenotech.com`
- Include all form data (name, email, company, message)
- Format emails with HTML and plain text versions

## 4. Testing

1. Start your development server: `npm run dev`
2. Go to the contact form
3. Fill out and submit the form
4. Check `Ask@akenotech.com` for the email

## 5. Production Deployment

For production deployment (Vercel, Netlify, etc.):
1. Add the environment variables to your hosting platform
2. Make sure `EMAIL_USER` and `EMAIL_PASS` are set in production
3. The contact form will work the same way

## Troubleshooting

- Make sure you're using an App Password, not your regular Gmail password
- Check that 2-factor authentication is enabled
- Verify the email address in `EMAIL_USER` is correct
- Check the console for any error messages

## Security Notes

- Never commit `.env.local` to version control
- Use App Passwords instead of regular passwords
- The email will be sent from your Gmail account to `Ask@akenotech.com`














