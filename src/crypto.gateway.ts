import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RedisService } from './redis.service';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://crypto-frontend-service:3000',
    credentials: true,
  },
})
export class CryptoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Socket;
  private logger: Logger = new Logger('CryptoGateway');
  constructor(private readonly redisService: RedisService) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToCryptoRates')
  handleSubscribe(client: Socket, payload: any): void {
    this.logger.log(
      `Client ${client.id} subscribed to crypto rates with payload:`,
      payload,
    );
  }

  async broadcastUpdateSignal() {
    this.logger.log('Broadcasting update signal to all connected clients');
    this.server.emit('cryptoRatesUpdateSignal');
  }

  async broadcastUpdatedCryptoData(): Promise<string> {
    const cryptoRates = await this.redisService.get('crypto_rates');
    return cryptoRates;
  }
}
