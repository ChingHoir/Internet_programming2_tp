import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptsModule } from './receipts/receipts.module';
import { Receipt } from './database/entities/receipts.entity';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    // Temporary SQLite fix in src/app.module.ts
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Receipt],
      synchronize: true,
    }),
    ReceiptsModule,
  ],
})
export class AppModule {}
