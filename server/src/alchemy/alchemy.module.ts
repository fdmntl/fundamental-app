import { Module } from '@nestjs/common';
import { AlchemyService } from './alchemy/alchemy.service';
import { AlchemyController } from './alchemy/alchemy.controller';

@Module({
  providers: [AlchemyService],
  controllers: [AlchemyController]
})
export class AlchemyModule {}
