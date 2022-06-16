import 'dotenv/config'
import { pool } from '@config/database'
import { user } from 'models/user'
import passport from 'passport'
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback,
} from 'passport-jwt'

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
}

function verifyCallback(jwtPayload: any, done: VerifiedCallback): void {
  pool.query('SELECT * FROM users').then((result) => {
    const users = result.rows

    const foundUser: user = users.find((user: user) => user.user_id === jwtPayload?.sub)

    if (foundUser) {
      return done(null, foundUser)
    } else {
      return done(null, false)
    }
  })
}

passport.use(new JwtStrategy(jwtOptions, verifyCallback))
