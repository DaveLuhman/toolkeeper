/* eslint-disable eqeqeq */ // for the material name search
import Material from '../models/Material.model.js'

const getMaterials = async (_req, res, next) => {
  try {
    const materials = await Material.find()
    res.locals.materials = materials
    return next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const getMaterialByID = async (req, res, next) => {
  const { id } = req.params
  try {
    const material = await Material.findById({ $eq: id })
    res.locals.materials = [material]
    return next()
  } catch (error) {
    res.status(500).json({ message: error.message })
    next()
  }
}

const createMaterial = async (req, res, next) => {
  const material = req.body
  const newMaterial = new Material(material)
  try {
    await newMaterial.save()
    return next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteMaterial = async (req, res, next) => {
  const { id } = req.params
  try {
    await Material.findByIdAndRemove({ $eq: id })
    return next()
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

const updateMaterial = async (req, res, next) => {
  const { id, name, description } = req.body
  try {
    const updatedMaterial = await Material.findByIdAndUpdate(
      { $eq: id },
      { name, description },
      { new: true }
    )
    res.locals.updatedMaterial = updatedMaterial
    return next()
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
// TODO: Use updatedAt value hashed to check for changes
const listMaterialNames = async (_req, res, next) => {
  res.locals.materials = await Material.find({}, { name: 1, id: 1 })
  return next()
}

// write a handlebars helper to lookup the material name based on the id
// https://stackoverflow.com/questions/28223460/handlebars-js-lookup-value-in-array-of-objects
const getMaterialName = (materials, id) => {
  try {
    const material = materials.filter((item) => {
      return item.id == id
    })
    return material[0].name
  } catch (error) {
    return 'Reference Error'
  }
}

export {
  getMaterials,
  getMaterialByID,
  createMaterial,
  deleteMaterial,
  updateMaterial,
  listMaterialNames,
  getMaterialName
}
