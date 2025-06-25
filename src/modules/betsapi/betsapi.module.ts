// src/modules/betsapi/betsapi.module.ts
import { Module } from '@nestjs/common';

import { BetsApiService } from './services/betsapi.service';
import { BetsApiController } from './controllers/betsapi.controller';

@Module({
  providers: [BetsApiService],
  controllers: [BetsApiController],
  exports: [BetsApiService],
})
export class BetsApiModule {}