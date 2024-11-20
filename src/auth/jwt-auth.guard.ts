// src/auth/jwt-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    // Log the authenticated user
    console.log('Authenticated User:', user);

    if (err || !user) {
      throw err || new Error('Invalid credentials');
    }
    return user;
  }
}

