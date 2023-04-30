import { Router } from 'express'
import {
  getMaterials,
  getMaterialByID,
  updateMaterial,
  createMaterial,
  deleteMaterial
} from '../../middleware/material.js'
import { sanitizeReqBody } from '../../middleware/util.js'

export const materialRouter = Router()

materialRouter.get('/', getMaterials, (_req, res) => {
  res.render('settings/materials')
})
// get tool material by ID and render edit page
materialRouter.get(
  '/edit/:id', // target
  getMaterialByID,
  (_req, res) => {
    res.render('settings/editMaterial') // render
  }
)
// update tool material
materialRouter.post(
  '/edit', // target
  sanitizeReqBody,
  updateMaterial,
  (_req, res) => {
    res.redirect('/settings/materials') // redirect
  }
)
// add new tool material
materialRouter.post('/create', sanitizeReqBody, createMaterial, (_req, res) => {
  res.redirect('/settings/materials')
})
// delete tool material
materialRouter.get('/delete/:id', deleteMaterial, (_req, res) => {
  res.redirect('/settings/materials')
})
