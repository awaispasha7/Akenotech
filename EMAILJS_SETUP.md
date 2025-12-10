# Alternative: EmailJS Setup (Easier Option)

If you prefer an easier setup without Gmail configuration, you can use EmailJS:

## 1. Install EmailJS

```bash
npm install @emailjs/browser
```

## 2. Update Contact Component

Replace the current `handleSubmit` function in `Contact.tsx` with:

```typescript
import emailjs from '@emailjs/browser';

const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const result = await emailjs.send(
      'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
      'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
      {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company,
        message: formData.message,
        to_email: 'Ask@akenotech.com'
      },
      'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
    );

    if (result.status === 200) {
      alert('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', company: '', message: '' });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    alert('Failed to send message. Please try again or email us directly.');
  } finally {
    setIsSubmitting(false);
  }
}, [formData]);
```

## 3. EmailJS Setup Steps

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Create a free account
3. Create an email service (Gmail, Outlook, etc.)
4. Create an email template
5. Get your Service ID, Template ID, and Public Key
6. Replace the placeholders in the code above

## Benefits of EmailJS

- No server-side code needed
- Works directly from the browser
- Free tier available
- Easy setup
- No need for Gmail app passwords

Choose the method that works best for you!
