// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AlchemyModule } from './alchemy/alchemy.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AlchemyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
