import {Router} from 'express'
import multer from 'multer'

import uploadConfig from './config/upload'
import OrphanagesController from './controllers/OrphanagesController'
import AuthController from './controllers/AuthController'
import authMiddleware from './middlewares/auth'

const routes = Router()
const upload = multer(uploadConfig)

routes.get('/', (req,res) =>{
     return res.send('Hello Trust')
})

routes.get('/orphanages', OrphanagesController.index)
routes.get('/orphanages/:id', OrphanagesController.show)
routes.post('/orphanages', upload.array('images'),OrphanagesController.create)
routes.get('/acceptedlist', OrphanagesController.getAcceptedList)
routes.get('/pendinglist', OrphanagesController.getPendingList)
routes.delete('/orphanages/:id', OrphanagesController.delete)
routes.patch('/orphanages/approve/:id/:accepted', OrphanagesController.accept)

routes.post('/auth', AuthController.authenticate)

//Auth
// routes.use(authMiddleware)

routes.get('/users', AuthController.index)
routes.post('/users', AuthController.create)



export default routes