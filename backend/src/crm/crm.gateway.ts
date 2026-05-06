import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server } from 'socket.io';
import { CrmSnapshot, NotificationRecord } from './seed-data';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CrmGateway {
  @WebSocketServer()
  server!: Server;

  emitStateUpdated(snapshot: CrmSnapshot) {
    this.server.emit('crm.state.updated', snapshot);
  }

  emitNotificationCreated(notification: NotificationRecord) {
    this.server.emit('crm.notification.created', notification);
  }
}