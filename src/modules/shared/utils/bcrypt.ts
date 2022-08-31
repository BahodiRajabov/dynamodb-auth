import { genSaltSync, hash, compare } from 'bcrypt';

export async function generateHash(password: string): Promise<string> {
  let salt = genSaltSync(10);
  return await hash(password, salt);
}

export async function compareHash(password: string, hash: string): Promise<boolean> {
  return await compare(password, hash)
}
