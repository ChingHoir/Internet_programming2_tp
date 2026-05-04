import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

import { CoreModule } from '../core/core.module';
@Module({
  imports: [CoreModule], // ✅ Use forwardRef to avoid circular dependency
  controllers: [],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
