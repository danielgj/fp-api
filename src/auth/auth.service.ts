import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthenticationError } from './errors/authentication.error';

@Injectable()
export class AuthService {
    
    constructor(
      private userService: UserService, 
      private jwtService: JwtService
    ) {}

    async signIn(email: string, pass: string): Promise<any> {
      
      try {
        const user = await this.userService.findUserByEmail(email);

        if (!user) {
          throw new AuthenticationError();
        }

        const passwordValid = await bcrypt.compare(pass, user.password)

        if (!passwordValid) {
          throw new AuthenticationError();
        }
        
        const payload = {
          id: user.id,
          email: user.email,
          isPro: user.isPro,
          isAdmin: user.isAdmin
        }      

        await this.userService.updateLastActiveAt(user.id);
        const token = await this.jwtService.signAsync(payload)


        return {
          access_token: token
        };

      } catch (e) {
        console.log(`Error in auth service: ${e}`)
        throw new AuthenticationError();
      }
    }

    async validateUser(email: string, pass: string): Promise<any> {
      
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        return null;
      }

      const passwordValid = await bcrypt.compare(pass, user.password)

      if (!passwordValid) {
        throw new AuthenticationError();
      }
      
      return user;
    }

}
