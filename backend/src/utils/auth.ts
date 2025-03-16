import bcryptjs from 'bcryptjs'

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10
  return await bcryptjs.hash(password, saltRounds)
}
