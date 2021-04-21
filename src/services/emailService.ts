import { User } from '../models';

type TemplateNameType = 'accountCreated' | 'accountVerified' | 'passwordForgot' | 'passwordReset';
type TemplateParamsType = { [key: string]: string; };

class EmailService {

  async sendEmail(user: User, template: TemplateNameType, params?: TemplateParamsType): Promise<void> {
    return console.log(`Sending '${template}' email to '${user.email}'.`);
  }

}

export const emailService = new EmailService();
