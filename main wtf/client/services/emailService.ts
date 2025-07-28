import emailjs from "@emailjs/browser";

// EmailJS configuration
const EMAIL_SERVICE_ID = "service_wtf_fitness"; // Replace with your EmailJS service ID
const EMAIL_TEMPLATE_ID = "template_password_reset"; // Replace with your EmailJS template ID
const EMAIL_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY"; // Replace with your EmailJS public key

// For demo purposes, we'll use a mock implementation
// In production, replace these with your actual EmailJS credentials

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

// Mock email service for demo
class MockEmailService {
  private generateResetToken(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private generateResetLink(token: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/reset-password?token=${token}`;
  }

  async sendPasswordResetEmail(
    email: string,
  ): Promise<{ success: boolean; message: string; resetLink?: string }> {
    try {
      // Generate reset token and link
      const resetToken = this.generateResetToken();
      const resetLink = this.generateResetLink(resetToken);

      // Store the reset token temporarily (in production, this would be stored in your backend)
      const resetData = {
        email,
        token: resetToken,
        expires: Date.now() + 60 * 60 * 1000, // 1 hour from now
      };
      localStorage.setItem(
        `wtf_reset_${resetToken}`,
        JSON.stringify(resetData),
      );

      // For demo purposes, show the email content in console
      console.log("📧 Password Reset Email Sent to:", email);
      console.log("📧 Reset Link:", resetLink);
      console.log("📧 Email Content:");
      console.log(`
        Subject: Reset Your WTF Fitness Password
        
        Hi there,
        
        You requested to reset your password for your WTF Fitness account.
        
        Click the link below to reset your password:
        ${resetLink}
        
        This link will expire in 1 hour.
        
        If you didn't request this reset, please ignore this email.
        
        Best regards,
        The WTF Fitness Team
      `);

      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        success: true,
        message: `Password reset email sent to ${email}. Check the browser console to see the reset link for demo purposes.`,
        resetLink, // Include for demo purposes
      };
    } catch (error) {
      console.error("Email service error:", error);
      return {
        success: false,
        message: "Failed to send password reset email. Please try again later.",
      };
    }
  }

  async validateResetToken(
    token: string,
  ): Promise<{ valid: boolean; email?: string }> {
    try {
      const resetDataStr = localStorage.getItem(`wtf_reset_${token}`);
      if (!resetDataStr) {
        return { valid: false };
      }

      const resetData = JSON.parse(resetDataStr);

      // Check if token has expired
      if (Date.now() > resetData.expires) {
        localStorage.removeItem(`wtf_reset_${token}`);
        return { valid: false };
      }

      return { valid: true, email: resetData.email };
    } catch (error) {
      console.error("Token validation error:", error);
      return { valid: false };
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const validation = await this.validateResetToken(token);
      if (!validation.valid || !validation.email) {
        return {
          success: false,
          message: "Invalid or expired reset token.",
        };
      }

      // Get stored users and update password
      const users = JSON.parse(localStorage.getItem("wtf_users") || "[]");
      const userIndex = users.findIndex(
        (u: any) => u.email === validation.email,
      );

      if (userIndex === -1) {
        return {
          success: false,
          message: "User not found.",
        };
      }

      // Update password
      users[userIndex].password = newPassword;
      localStorage.setItem("wtf_users", JSON.stringify(users));

      // Remove used token
      localStorage.removeItem(`wtf_reset_${token}`);

      return {
        success: true,
        message: "Password successfully updated.",
      };
    } catch (error) {
      console.error("Password reset error:", error);
      return {
        success: false,
        message: "Failed to reset password. Please try again.",
      };
    }
  }
}

// Real EmailJS service (commented out for demo)
class EmailJSService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    emailjs.init(config.publicKey);
  }

  async sendPasswordResetEmail(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const resetToken =
        Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;

      // Store reset token
      const resetData = {
        email,
        token: resetToken,
        expires: Date.now() + 60 * 60 * 1000,
      };
      localStorage.setItem(
        `wtf_reset_${resetToken}`,
        JSON.stringify(resetData),
      );

      // Send email via EmailJS
      await emailjs.send(this.config.serviceId, this.config.templateId, {
        to_email: email,
        reset_link: resetLink,
        user_name: email.split("@")[0],
      });

      return {
        success: true,
        message: `Password reset email sent to ${email}.`,
      };
    } catch (error) {
      console.error("EmailJS error:", error);
      return {
        success: false,
        message: "Failed to send password reset email. Please try again later.",
      };
    }
  }
}

// Export the service instance
// Use MockEmailService for demo, switch to EmailJSService for production
export const emailService = new MockEmailService();

// For production use:
// export const emailService = new EmailJSService({
//   serviceId: EMAIL_SERVICE_ID,
//   templateId: EMAIL_TEMPLATE_ID,
//   publicKey: EMAIL_PUBLIC_KEY,
// });
