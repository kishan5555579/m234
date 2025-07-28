// SMS Service for OTP functionality
// In production, this would integrate with services like Twilio, AWS SNS, etc.

export interface SMSResponse {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}

export interface OTPData {
  phoneNumber: string;
  otp: string;
  sessionId: string;
  timestamp: Date;
}

class SMSService {
  private apiKey: string | null = null;
  private baseUrl: string = "https://api.twilio.com/2010-04-01"; // Example Twilio URL

  constructor() {
    // In production, get this from environment variables
    // Vite uses import.meta.env instead of process.env
    this.apiKey = import.meta.env.VITE_TWILIO_API_KEY || null;
  }

  // Send OTP via SMS
  async sendOTP(phoneNumber: string, otp: string, sessionId: string): Promise<SMSResponse> {
    try {
      // Format phone number (ensure it starts with country code)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const message = `Your WTF Fitness session OTP is: ${otp}. This code expires in 5 minutes. Do not share this code with anyone.`;
      
      // In production environment, use real SMS API
      if (this.apiKey && import.meta.env.PROD) {
        return await this.sendViaTwilio(formattedPhone, message);
      } else {
        // For development, simulate SMS sending
        return await this.simulateSMS(formattedPhone, message, otp);
      }
    } catch (error) {
      console.error('SMS Service Error:', error);
      return {
        success: false,
        message: "Failed to send SMS",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  // Send session start notification
  async sendSessionStartNotification(phoneNumber: string, trainerName: string): Promise<SMSResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const message = `Your fitness session with ${trainerName} has started! Time to get fit! 💪`;

      if (this.apiKey && import.meta.env.PROD) {
        return await this.sendViaTwilio(formattedPhone, message);
      } else {
        return await this.simulateSMS(formattedPhone, message);
      }
    } catch (error) {
      console.error('SMS Service Error:', error);
      return {
        success: false,
        message: "Failed to send notification",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  // Send session completion notification
  async sendSessionCompletionNotification(
    phoneNumber: string,
    trainerName: string,
    duration: number
  ): Promise<SMSResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const message = `Great job! Your ${duration}-minute session with ${trainerName} is complete. Keep up the great work! 🎉`;

      if (this.apiKey && import.meta.env.PROD) {
        return await this.sendViaTwilio(formattedPhone, message);
      } else {
        return await this.simulateSMS(formattedPhone, message);
      }
    } catch (error) {
      console.error('SMS Service Error:', error);
      return {
        success: false,
        message: "Failed to send notification",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  // Production Twilio implementation
  private async sendViaTwilio(phoneNumber: string, message: string): Promise<SMSResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/Accounts/YOUR_ACCOUNT_SID/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`YOUR_ACCOUNT_SID:${this.apiKey}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: '+1234567890', // Your Twilio phone number
          To: phoneNumber,
          Body: message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: "SMS sent successfully",
          messageId: data.sid
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: "Failed to send SMS",
          error: error.message
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Network error",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  // Development simulation
  private async simulateSMS(phoneNumber: string, message: string, otp?: string): Promise<SMSResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Simulate occasional failures (5% chance)
    if (Math.random() < 0.05) {
      return {
        success: false,
        message: "Simulated network failure",
        error: "Network timeout"
      };
    }

    // Log for development
    console.log(`📱 SMS to ${phoneNumber}: ${message}`);
    if (otp) {
      console.log(`🔐 OTP: ${otp} (for development testing)`);
    }

    return {
      success: true,
      message: `SMS sent successfully to ${phoneNumber}`,
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  // Format phone number to international format
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digits
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // If it doesn't start with country code, assume US (+1)
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('+')) {
      return phoneNumber;
    }
    
    return `+${cleaned}`;
  }

  // Validate phone number format
  isValidPhoneNumber(phoneNumber: string): boolean {
    const formatted = this.formatPhoneNumber(phoneNumber);
    // Basic validation for international format
    return /^\+[1-9]\d{10,14}$/.test(formatted);
  }

  // Get formatted display number
  getDisplayPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      const withoutCountryCode = cleaned.slice(1);
      return `+1 (${withoutCountryCode.slice(0, 3)}) ${withoutCountryCode.slice(3, 6)}-${withoutCountryCode.slice(6)}`;
    }
    
    return phoneNumber;
  }
}

// Export singleton instance
export const smsService = new SMSService();

// Export for testing purposes
export { SMSService };
