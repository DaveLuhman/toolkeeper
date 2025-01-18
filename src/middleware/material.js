import { Material } from '../models/index.models.js';

/**
 * Retrieves all materials.
 */
const getMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find({ tenant: { $eq: req.user.tenant.valueOf() } });
    res.locals.materials = materials;
    return next();
  } catch (error) {
    req.logger.error({
      message: 'Failed to fetch materials',
      metadata: { tenantId: req.user.tenant.valueOf() },
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a material by ID.
 */
const getMaterialByID = async (req, res, next) => {
  const { id } = req.params;
  try {
    const material = await Material.findById({ _id: id });
    res.locals.materials = [material];
    return next();
  } catch (error) {
    req.logger.error({
      message: `Failed to fetch material with ID ${id}`,
      metadata: { materialId: id, tenantId: req.user.tenant.valueOf() },
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
};

/**
 * Creates a new material.
 */
const createMaterial = async (req, res, next) => {
  const material = req.body;
  material.tenant = req.user.tenant.valueOf();
  const newMaterial = new Material(material);
  try {
    await newMaterial.save();
    return next();
  } catch (error) {
    req.logger.error({
      message: 'Failed to create material',
      metadata: { materialDetails: req.body, tenantId: req.user.tenant.valueOf() },
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
};

/**
 * Deletes a material.
 */
const deleteMaterial = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Material.findByIdAndRemove({ _id: id });
    return next();
  } catch (error) {
    req.logger.error({
      message: `Failed to delete material with ID ${id}`,
      metadata: { materialId: id, tenantId: req.user.tenant.valueOf() },
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a material.
 */
const updateMaterial = async (req, res, next) => {
  const { id, name, description } = req.body;
  try {
    const updatedMaterial = await Material.findByIdAndUpdate(
      { _id: id },
      { name, description },
      { new: true }
    );
    res.locals.updatedMaterial = updatedMaterial;
    return next();
  } catch (error) {
    req.logger.error({
      message: `Failed to update material with ID ${id}`,
      metadata: { materialId: id, tenantId: req.user.tenant.valueOf() },
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
};

export {
  getMaterials,
  getMaterialByID,
  createMaterial,
  deleteMaterial,
  updateMaterial,
};

// src\middleware\material.js
