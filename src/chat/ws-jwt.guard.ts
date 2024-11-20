// src/chat/ws-jwt.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      console.log('======999====== WS Connection attempt ============');
      console.log('Headers:', client.handshake.headers);
      console.log('Query:', client.handshake.query);
      console.log('Auth:', client.handshake.auth);
      
      const token = this.extractToken(client);
      
      if (!token) {
        console.log('❌ No token found in request');
        throw new WsException('Unauthorized: No token provided');
      }

      console.log('✓ Token found:', token.substring(0, 20) + '...');
      
      try {
        const payload = await this.jwtService.verify(token);
        console.log('✓ Token verified, user:', payload.username);
        client.data.user = payload;  // Store the decoded payload in client.data.user
        return true;
      } catch (error) {
        console.log('❌ Token verification failed:', error.message);
        throw new WsException('Unauthorized: Invalid token');
      }
    } catch (err) {
      console.log('❌ Guard error:', err.message);
      throw new WsException(err.message);
    }
  }

  private extractToken(client: Socket): string | null {
    console.log('Extracting token from request...');

    // 1. Check auth object (first priority)
    if (client.handshake.auth?.token) {
      console.log('Found token in auth object');
      return client.handshake.auth.token;
    }

    // 2. Check Authorization header (second priority)
    const authHeader = client.handshake.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      console.log('Found token in Authorization header');
      return authHeader.slice(7);  // Remove 'Bearer ' prefix
    }

    // 3. Check query parameters (last priority)
    if (client.handshake.query.token) {
      console.log('Found token in query parameters');
      return client.handshake.query.token as string;
    }

    console.log('No token found in any location');
    return null;
  }
}
