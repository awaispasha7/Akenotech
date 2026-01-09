import emailjs from '@emailjs/browser';

interface VideoReadyEmailParams {
  userEmail: string;
  userName: string;
  videoUrl: string;
  jobId: string;
}

export const sendVideoReadyEmail = async (params: VideoReadyEmailParams): Promise<void> => {
  try {
    // EmailJS credentials
    const serviceId = 'service_4yz4k76';
    const templateId = 'template_labwpyi'; // Your new template ID
    const publicKey = 'Id7n5AZzArVL9Zys_';

    const templateParams = {
      to_name: params.userName,
      to_email: params.userEmail,
      video_url: params.videoUrl,
      job_id: params.jobId
    };

    console.log('Sending video ready email with:', { 
      serviceId, 
      templateId, 
      to_email: params.userEmail,
      video_url: params.videoUrl 
    });
    
    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    if (result.status === 200) {
      console.log('✅ Video ready email sent successfully to:', params.userEmail);
    } else {
      console.error('⚠️ EmailJS error status:', result.status);
    }
  } catch (error: any) {
    console.error('❌ Failed to send video ready email:', error);
    // Don't throw - email failure shouldn't block the user from seeing the result
  }
};
