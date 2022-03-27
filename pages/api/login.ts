import type { NextApiRequest, NextApiResponse } from 'next'
import type { StandardReplyMsg } from '../../types/StandardReplyMsg'
import type { LoginResponse } from '../../types/LoginResponse'
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import { UserModel } from '../../models/UserModel'
import { connectMongoDB } from '../../middlewares/connectMongoDB'

const endpointLogin = async (
  req: NextApiRequest,
  res: NextApiResponse<StandardReplyMsg | LoginResponse>
) => {

  const { KEY_JWT } = process.env
  if (!KEY_JWT) {
    return res.status(500).json({ erro: 'ENV JWT não informado' })
  }

  if (req.method === 'POST') {
    const { login, password } = req.body

    const userFound = await UserModel.find({ email: login, password: md5(password) })
    if (userFound && userFound.length > 0) {
      const loggedUser = userFound[0]

      const token = jwt.sign({ _id: loggedUser._id }, KEY_JWT)
      return res.status(200).json({ name: loggedUser.name, email: loggedUser.email, token })
    }
    return res.status(400).json({ erro: 'Usuario ou senha nao encontrado' })
  }
  return res.status(405).json({ erro: 'Metodo informado nao e valido' })
}

export default connectMongoDB(endpointLogin)