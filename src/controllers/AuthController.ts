import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import User from '../models/User'
import usersView from '../views/users_view'
import * as Yup from 'yup'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as authconfig from '../config/auth.json'

function generateToken(id:number){
     return jwt.sign({ id: id } , authconfig.secret ,{
           expiresIn: 86400,
      })
 }
export default {


     async create(request: Request, response: Response) {
          const {
               name,
               email,
               password
          } = request.body


          const userRepository = getRepository(User)

          const data = {
               name, email, password
          }

          const pass = await bcrypt.hash(data.password, 8)
          data.password = pass

          const schema = Yup.object().shape({
               name: Yup.string().required(),
               email: Yup.string().required(),
               password: Yup.string().required()
          })

          await schema.validate(data, {
               abortEarly: false
          })

          const user = userRepository.create(data)

          await userRepository.save(user)
          const token = generateToken(user.id)
          user.password = ''          
          return response.status(201).json(usersView.render(user,token))
     },

     async authenticate(request: Request, response: Response) {
          const {
               email,
               password,
               
          } = request.body
          
          console.log(request.body)
          const userRepository = getRepository(User)

          const user = await userRepository.findOne({email: email})

          if (!user){
               return response.status(400).json({ "erro": "User not found"})
          }
          if (! await bcrypt.compare(password, user.password)){
               return response.status(400).json({ "erro": "Invalid Password"})
          }

          user.password = ''
          const token = generateToken(user.id)

          return response.json(usersView.render(user,token))
     },

     async index(request: Request, response: Response) {
          const usersRepository = getRepository(User)

          const users = await usersRepository.find()

          return response.json(usersView.renderMany(users))
     }


}