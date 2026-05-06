import { Module } from '@nestjs/common';
import { CrmController } from './crm.controller';
import { CrmGateway } from './crm.gateway';
import { CrmStateService } from './crm-state.service';

@Module({
  controllers: [CrmController],
  providers: [CrmGateway, CrmStateService],
})
export class CrmModule {}