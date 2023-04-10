import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthenticationError } from './errors/authentication.error';

@Injectable()
export class AuthService {
    
    constructor(private userService: UserService, private jwtService: JwtService) {}

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

        return {
          access_token: payload //this.jwtService.sign(payload)
        };
      } catch (e) {
        console.log(`Dani: ${e}`)
        throw new AuthenticationError();
      }
    }

}
