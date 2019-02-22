import { Strategy, IVerifyOptions } from 'passport-local';
import { UserService } from '../services/user.service';
import { HttpException, Injectable } from '@nestjs/common';
import { use } from 'passport';
import passport = require('passport');

@Injectable()
export class LocalStrategy {
    constructor(private readonly authService: UserService) {
        this.init();
    }

    private init(): void {
        passport.serializeUser((user, done) => {
            done(null, user);
        });

        passport.deserializeUser((user, done) => {
            done(null, user);
        });

        use('local-signin', new Strategy({
            usernameField: 'email',
            passwordField: 'password',
        }, async (email: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) => {
            try {
                const foundUser = await this.authService.validateUser(email, password);
                if (!foundUser) { throw new HttpException('User not found', 401); }
                done(null, foundUser);
            } catch (error) {
                done(error, false);
            }
        }));
    }
}
