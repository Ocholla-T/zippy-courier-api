import { user } from 'models/user'
import jsonwebtoken from 'jsonwebtoken'
import 'dotenv/config'

export function issueJWT(user: user) {
  const user_id: string = user.user_id

  const expiresIn = '1d'

  const payload = {
    sub: user_id,
    issuedAt: Date.now(),
  }

  const signedToken = jsonwebtoken.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: expiresIn,
  })

  return {
    token: 'Bearer ' + signedToken,
    expires: expiresIn,
  }
}
