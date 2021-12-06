const db = require("../db");
const { ObjectId } = require('mongodb');

const add = async (service) => {
  await db.writeDB('services', service);
}

const getServicesByEmail = async (email) => {
  const services = db.readDB('services', { ownerEmail: email });
  return services;
}

const getServicesByID = async (id) => {
  const services = await db.readDB('services', { _id: ObjectId(id) });
  return services[0];
}

const updateService = async (id, updatedService) => {
  const updateCount = db.update('services', id, updatedService)
  return updateCount;
}

const deleteService = async (id) => {
  return await db.delete('services',id);
}

module.exports = {
  add,
  getServicesByEmail,
  getServicesByID,
  updateService,
  deleteService
}
