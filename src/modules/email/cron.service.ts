import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from './email.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private emailService: EmailService) {}

  // Executa todos os dias às 9h
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyReport() {
    this.logger.log('Executando envio de relatório diário...');
    await this.emailService.sendDailyReport();
  }

  // Exemplo: executa a cada 5 minutos (para testes)
  // @Cron('*/1 * * * *')
  // async handleTestCron() {
  //   this.logger.log('Cron de teste executado');
  //   await this.emailService.sendDailyReport();
  // }
}