import { Body, Controller, Get, Inject, Post, Put } from '@nestjs/common';
import { CrmStateService } from './crm-state.service';
import { LeadRecord, SupplierBillRecord } from './seed-data';

@Controller('api')
export class CrmController {
  constructor(@Inject(CrmStateService) private readonly crmStateService: CrmStateService) {}

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('bootstrap')
  getBootstrap() {
    return this.crmStateService.getBootstrap();
  }

  @Put('leads/snapshot')
  replaceLeadSnapshot(@Body() body: { leads: LeadRecord[]; assignLogs?: Array<Record<string, unknown>>; reason?: string }) {
    return this.crmStateService.replaceLeadSnapshot(body);
  }

  @Post('leads/confirm-assignments')
  confirmAssignments(@Body() body: { assignments: Array<Record<string, unknown>> }) {
    return this.crmStateService.confirmAssignments(body.assignments || []);
  }

  @Put('supplier-bills/snapshot')
  replaceSupplierBills(@Body() body: { bills: SupplierBillRecord[] }) {
    return this.crmStateService.replaceSupplierBills(body.bills || []);
  }

  @Post('notifications/mark-read')
  markNotificationsRead() {
    return this.crmStateService.markNotificationsRead();
  }
}