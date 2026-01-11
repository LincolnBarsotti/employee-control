import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM'),
        to,
        subject,
        html,
      });

      this.logger.log(`Email enviado: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Erro ao enviar email: ${error.message}`);
      throw error;
    }
  }

  async sendDailyReport() {
    try {
      const admins = await this.prisma.user.findMany({
        where: {
          role: 'ADMIN',
          isActive: true,
        },
      });

      const totalEmployees = await this.prisma.employee.count({
        where: { isActive: true },
      });

      const recentEmployees = await this.prisma.employee.findMany({
        where: {
          isActive: true,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // últimas 24 horas
          },
        },
      });

      const html = this.generateReportHtml(totalEmployees, recentEmployees.length);

      for (const admin of admins) {
        await this.sendEmail(
          admin.email,
          'Relatório Diário de Funcionários',
          html,
        );
      }

      this.logger.log(`Relatório diário enviado para ${admins.length} administradores`);
    } catch (error) {
      this.logger.error(`Erro ao enviar relatório diário: ${error.message}`);
    }
  }

  private generateReportHtml(total: number, newEmployees: number): string {
    return `
     <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { 
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
        background-color: #f9fafb; 
        margin: 0; 
        padding: 40px 0;
      }
      .container { 
        max-width: 500px; 
        margin: 0 auto; 
        background: #ffffff; 
        border-radius: 12px; 
        overflow: hidden; 
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        border: 1px solid #e5e7eb;
      }
      .header { 
        background: #10b981; 
        color: white; 
        padding: 30px 20px; 
        text-align: center; 
      }
      .header h1 { 
        margin: 0; 
        font-size: 22px; 
        font-weight: 600; 
        letter-spacing: -0.5px;
      }
      .content { 
        padding: 30px; 
      }
      .stat-grid {
        display: flex;
        gap: 15px;
        margin-bottom: 25px;
      }
      .stat { 
        flex: 1;
        background: #ffffff; 
        padding: 20px; 
        border: 1px solid #f0f0f0;
        border-radius: 8px; 
        text-align: center;
        transition: transform 0.2s;
      }
      .stat-label { 
        font-size: 12px; 
        color: #6b7280; 
        text-transform: uppercase; 
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        display: block;
      }
      .stat-value { 
        font-size: 32px; 
        font-weight: 800; 
        color: #111827; 
      }
      .footer {
        padding: 20px 30px;
        background: #fdfdfd;
        border-top: 1px solid #f3f4f6;
        color: #9ca3af;
        font-size: 13px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Relatório de Equipe</h1>
      </div>
      <div class="content">
        <div class="stat-grid">
          <div class="stat">
            <span class="stat-label">Ativos</span>
            <div class="stat-value">${total}</div>
          </div>
          <div class="stat">
            <span class="stat-label">Novos (24h)</span>
            <div class="stat-value" style="color: #10b981;">+${newEmployees}</div>
          </div>
        </div>
      </div>
      <div class="footer">
        Gerado em: <strong>${new Date().toLocaleDateString('pt-BR')}</strong>
      </div>
    </div>
  </body>
  </html>
    `;
  }
}
