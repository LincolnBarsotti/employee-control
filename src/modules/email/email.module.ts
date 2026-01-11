import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { CronService } from './cron.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [EmailService, CronService, PrismaService],
  exports: [EmailService],
})
export class EmailModule {}