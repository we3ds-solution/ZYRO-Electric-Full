// Open/Closed Principle: New notification channels can be added without modifying existing code

import { Injectable } from '@angular/core';

export interface INotificationChannel {
  getName(): string;
  send(recipient: string, subject: string, message: string): Promise<boolean>;
}

export class EmailNotification implements INotificationChannel {
  getName(): string {
    return 'Email';
  }

  async send(_recipient: string, _subject: string, _message: string): Promise<boolean> {
    // Do not log raw payloads - recipient, subject, and message may contain PII
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  }
}

export class SMSNotification implements INotificationChannel {
  getName(): string {
    return 'SMS';
  }

  async send(_recipient: string, _subject: string, _message: string): Promise<boolean> {
    // Do not log raw payloads - recipient, subject, and message may contain PII
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
}

export class PushNotification implements INotificationChannel {
  getName(): string {
    return 'Push';
  }

  async send(_recipient: string, _subject: string, _message: string): Promise<boolean> {
    // Do not log raw payloads - recipient, subject, and message may contain PII
    return new Promise(resolve => setTimeout(() => resolve(true), 200));
  }
}

export class SlackNotification implements INotificationChannel {
  getName(): string {
    return 'Slack';
  }

  async send(_recipient: string, _subject: string, _message: string): Promise<boolean> {
    // Do not log raw payloads - recipient, subject, and message may contain PII
    return new Promise(resolve => setTimeout(() => resolve(true), 400));
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationChannelFactory {
  private channels = new Map<string, INotificationChannel>([
    ['email', new EmailNotification()],
    ['sms', new SMSNotification()],
    ['push', new PushNotification()],
    ['slack', new SlackNotification()]
  ]);

  getChannel(type: string): INotificationChannel | undefined {
    return this.channels.get(type.toLowerCase());
  }

  registerChannel(type: string, channel: INotificationChannel): void {
    this.channels.set(type.toLowerCase(), channel);
  }

  getAllChannels(): INotificationChannel[] {
    return Array.from(this.channels.values());
  }

  async sendMultiple(recipient: string, subject: string, message: string, channels: string[]): Promise<boolean[]> {
    return Promise.all(
      channels.map(async (channel) => {
        const impl = this.getChannel(channel);
        return impl ? impl.send(recipient, subject, message) : false;
      })
    );
  }
}
