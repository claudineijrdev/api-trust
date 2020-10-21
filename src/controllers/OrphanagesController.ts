import {Request, Response} from 'express'
import { getRepository } from 'typeorm'

import orphanageView from '../views/orphanages_view'
import Orphanage from '../models/Orphanage'
import * as Yup from 'yup'

export default{
     async index(request: Request, response: Response){

          const orphanagesRepository = getRepository(Orphanage)

          const orphanages = await orphanagesRepository.find({
               relations: ['images']
          })

          return response.json(orphanageView.renderMany(orphanages))
     },
     
     async show(request: Request, response: Response){
          const { id } = request.params
          console.log('show')
          const orphanagesRepository = getRepository(Orphanage)

          const orphanage = await orphanagesRepository.findOneOrFail(id, {
               relations: ['images']
          })

          return response.json(orphanageView.render(orphanage))
     },
     async delete(request: Request, response: Response){
          const { id } = request.params
          const orphanagesRepository = getRepository(Orphanage)

          const orphanage = await orphanagesRepository.delete(id)

          return response.json({"msg":"removido com sucesso"} )
     },
     async getAcceptedList(request: Request, response: Response){
          console.log('accepted')
          const orphanagesRepository = getRepository(Orphanage)

          const orphanages = await orphanagesRepository.find({
              where:  [{accepted:  "1"}],
               relations: ['images']
          })

          return response.json(orphanageView.renderMany(orphanages))
     },
     async getPendingList(request: Request, response: Response){
          const orphanagesRepository = getRepository(Orphanage)

          const orphanages = await orphanagesRepository.find({
              where:  [{pending:  "1"}],
               relations: ['images']
          })

          return response.json(orphanageView.renderMany(orphanages))
     },

     async accept(request: Request, response: Response){
          const { id, accepted } = request.params
          // console.log(request.params)
          const orphanagesRepository = getRepository(Orphanage)

          const orphanage = await orphanagesRepository.findOneOrFail(id, {
               relations: ['images']
          })
          if (orphanage){
               const ret =  await orphanagesRepository.update(id, {accepted : accepted === '1', pending: false})
          }

          return response.json(orphanageView.render(orphanage))
     },

     async create(request: Request, response: Response){
          const {   
               name,
               latitude,
               longitude,
               about,
               instructions,
               opening_hours,
               open_on_weekends,
               pending,
               accepted
          } = request.body

          const orphanageRepository = getRepository(Orphanage)

          const requestImages = request.files as Express.Multer.File[]
          const images = requestImages.map(image =>{
               return { path: image.filename}
          })

          const data = {
               name,
               latitude,
               longitude,
               about,
               instructions,
               opening_hours,
               open_on_weekends: open_on_weekends === 'true',
               pending: pending === 'true',
               accepted: accepted === 'true',               
               images
          }

          const schema = Yup.object().shape({
               name: Yup.string().required(),               
               latitude: Yup.number().required(),               
               longitude: Yup.number().required(),               
               about: Yup.string().required().max(300),               
               instructions: Yup.string().required(),               
               opening_hours: Yup.string().required(),               
               open_on_weekends: Yup.boolean().required(),
               pending: Yup.boolean().required(),
               accepted: Yup.boolean().required(),
               images: Yup.array(Yup.object().shape({
                    path: Yup.string().required()
               }))               
          })

          await schema.validate(data, {
               abortEarly: false
          })

          const orphanage = orphanageRepository.create (data)

          await orphanageRepository.save(orphanage)

          return response.status(201).json(orphanage)
     }
}