import type { NextApiRequest, NextApiResponse } from 'next'
import type { StandardReplyMsg } from '../../types/StandardReplyMsg'
import type { RegistrationRequisition } from '../../types/RegistrationRequisition'
import { UserModel } from '../../models/UserModel'
import md5 from 'md5'
import { connectMongoDB } from '../../middlewares/connectMongoDB'

const endpointRegister = async (req: NextApiRequest, res: NextApiResponse<StandardReplyMsg>) => {

  if (req.method === 'POST') {
    const user = req.body as RegistrationRequisition

    if (!user.name || user.name.length < 2) {
      return res.status(400).json({ erro: 'Nome invalido' })
    }

    if (!user.email || user.email.length < 5 || !user.email.includes('@') || !user.email.includes('.')) {
      return res.status(400).json({ erro: 'Email invalido' })
    }

    if (!user.password || user.password.length < 4) {
      return res.status(400).json({ erro: 'Senha invalida' })
    }

    // validação se ja existe Usuario com o mesmo Email
    const userEmailAlreadyExists = await UserModel.find({ email: user.email })
    if (userEmailAlreadyExists && userEmailAlreadyExists.length > 0) {
      return res.status(400).json({ erro: 'Ja existe uma conta com email informado' })
    }

    // salvar no bacno de dados
    const userHash = {
      name: user.name,
      email: user.email,
      password: md5(user.password),
    }
    await UserModel.create(userHash)
    return res.status(200).json({ msg: 'Usuario cadastrado com sucesso!' })
  }
  return res.status(405).json({ erro: 'Metodo informado nao e valido' })
}

export default connectMongoDB(endpointRegister)