import { QueryResult } from 'pg'
import { pool } from '@config/database'

export async function createUser(username: string, password: string) {
  let newUser: QueryResult<any> = await pool.query(
    'INSERT INTO users(email, password) VALUES($1, $2) RETURNING user_id',
    [username, password],
  )

  return newUser.rows[0].user_id
}
