import User from '../models/User'

export default{
     render(user : User, token?:string){
          return {
               id: user.id,
               name: user.name,
               email: user.email,
               password: user.password,
               token: token,
          }
     },
     renderMany(users: User[]){
          return users.map(user => this.render(user))
     }
}
