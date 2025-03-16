import bcryptjs from 'bcryptjs'
export const generateToken = () =>
  Math.floor(100000 + Math.random() * 900000).toString()

export const checkPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcryptjs.compare(password, hash)
}
