import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import type { StandardReplyMsg } from '../types/StandardReplyMsg'

import mongoose from 'mongoose'

export const connectMongoDB = (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<StandardReplyMsg>) => {

    //  verirficar se o banco ja esta conectado, se estiver seguir para o próximo endpoint ou próximo middleware
    if (mongoose.connections[0].readyState) {
      return handler(req, res)
    }

    // ja que não esta conectado vamos conectar
    // obter a variavel de ambiente preenchida do ENV
    const { DB_CONNECTION_STRING } = process.env

    // se a env estiver vazia aborta o uso do sistema e avisa o programador
    if (!DB_CONNECTION_STRING) {
      return res.status(500).json({ erro: 'ENV de configuração do banco, não informado' })
    }

    mongoose.connection.on('connected', () => console.log('Banco de dados conectado'))
    mongoose.connection.on('error', error => console.log(`Ocorreu erro ao conectar no banco: ${error}`))
    await mongoose.connect(DB_CONNECTION_STRING)

    // agora posso seguir para o endpoint, pois estou conectado no bacno
    return handler(req, res)
  }
