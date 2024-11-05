import { Module } from '@nestjs/common';
import { AlchemyService } from './alchemy.service';
import { AlchemyController } from './alchemy.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AlchemyService],
  controllers: [AlchemyController],
})
export class AlchemyModule {}
