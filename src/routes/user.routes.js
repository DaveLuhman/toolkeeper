import { Router as expressRouter } from 'express'
import { updateUser, resetPassword } from '../middleware/user.js'

export const userRouter = expressRouter()
// show user their own profile
userRouter.get('/profile', (_req, res) => {
  res.render('profile', { layout: 'user.hbs' })
})
// update user's own profile
userRouter.post('/profile', updateUser, (_req, res) => {
  res.redirect('/user/profile')
})
// update user's own password
userRouter.post('/resetPassword', resetPassword, (_req, res) => {
  res.redirect('/user/profile')
})
