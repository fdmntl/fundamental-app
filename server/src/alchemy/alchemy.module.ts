import { Module } from '@nestjs/common';
import { AlchemyService } from './alchemy.service';
import { AlchemyController } from './alchemy.controller';


@Module({
  providers: [AlchemyService],
  controllers: [AlchemyController]
})
export class AlchemyModule {}
