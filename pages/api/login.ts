import type { NextApiRequest, NextApiResponse } from 'next'
import { connectMongoDB } from '../../middlewares/connectMongoDB'
import type { standardReplyMsg } from '../../types/standardReplyMsg'

const endpointLogin = (
  req: NextApiRequest,
  res: NextApiResponse<standardReplyMsg>
) => {
  if (req.method === 'POST') {
    const { login, senha } = req.body

    if (login === 'admin@admin.com' && senha === 'Admin@123') {
      return res.status(200).json({ msg: 'Usuario autenticado com sucesso' })
    }
    return res.status(400).json({ erro: 'Usuario ou senha nao incorreto' })
  }
  return res.status(405).json({ erro: 'Metodo informado nao e valido' })
}

export default connectMongoDB(endpointLogin)