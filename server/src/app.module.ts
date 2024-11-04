import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlchemyModule } from './alchemy/alchemy.module';

@Module({
  imports: [AlchemyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
