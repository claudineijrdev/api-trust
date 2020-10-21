import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import * as authconfig from '../config/auth.json' 

export default (req:Request, res:Response, next:NextFunction) =>{
     const authReader = req.headers.authorization

     if(!authReader){
          return res.status(401).send({ erro: 'No privided token!'})
     }

     const parts = authReader.split(' ')

     if(parts.length !== 2){
          return res.status(401).send({ erro: 'Token error'})
     }

     const [ scheme, token ] = parts

     if(!/^Bearer$/i.test(scheme)){
          return res.status(401).send( { error: 'Token malformatted' })
     }

     jwt.verify(token, authconfig.secret, (err, decoded) =>{
          if(err) return res.status(401).send({ error: 'Token invalid'})

          // req.userId = decoded.id

          return next()
     })
}