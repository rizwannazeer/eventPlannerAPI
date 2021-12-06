var express = require('express');

const servicesModel = require("../model/services");
var authMiddleware = require("../middleware/authentication")
var services = express.Router();

services.use(authMiddleware)

services.post('/add', async function (req, res) {
  if (!req.body) {
    res.statusCode = 400;
    res.send('invalid request');
    return;
  }

  const { serviceType, description, price, ownerEmail } = req.body;
  if (!serviceType) {
    res.statusCode = 400;
    res.send('serviceType required');
    return;
  }
  if (!description) {
    res.statusCode = 400;
    res.send('description required');
    return;
  }
  if (!price) {
    res.statusCode = 400;
    res.send('price required');
    return;
  }

  if (!ownerEmail) {
    res.statusCode = 401;
    res.send('you are not allowed to access this resource');
    return;
  }

  try {
    await servicesModel.add({
      serviceType, price, description, ownerEmail
    })
    res.send({ message: 'service added successfully' })
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: 'something went wrong' })
  }
});

services.patch('/', async function (req, res) {
  if (!req.query.id) {
    res.statusCode = 400;
    res.send('invalid request; ID required');
    return;
  }
  const { serviceType, description, price, ownerEmail } = req.body;
  try {
    const existingService = await servicesModel.getServicesByID(req.query.id);
    console.log('existingService', req.query.id, existingService);
    console.log(ownerEmail, existingService.ownerEmail);
    if (!existingService || existingService.ownerEmail != ownerEmail) {
      res.statusCode = 400;
      res.send({ error: 'invalid service id' });
      return;
    }
    let newService = {
      ...existingService,
    }
    if (serviceType) {
      newService.serviceType = serviceType
    }
    if (price) {
      newService.price = price
    }
    if (description) {
      newService.description = description
    }
    await servicesModel.updateService(req.query.id, newService)
    res.send({message: 'service updated'})
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: 'something went wrong' })
  }
})

services.get('/', async function (req, res) {
  const { ownerEmail } = req.body;
  if (!ownerEmail) {
    res.statusCode = 401;
    res.send('you are not allowed to access this resource');
    return;
  }

  try {
    const result = await servicesModel.getServicesByEmail(ownerEmail);
    const data = result.map((doc) => ({
      serviceId: doc._id,
      serviceType: doc.serviceType,
      price: doc.price,
      description: doc.description
    }))
    res.send({ data })
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: 'something went wrong' })
  }
});

services.delete('/', async function (req, res) {
  if (!req.query.id) {
    res.statusCode = 400;
    res.send('invalid request; ID required');
    return;
  } 

  try {
    const deletedCount = await servicesModel.deleteService(req.query.id)
    if(deletedCount) {
      res.send({ message: 'service deleted successfully' })
    }
    else {
      res.send({ message: 'unable to delete the service. Please verify the service ID' })
    }
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: 'something went wrong' })
  }

});

module.exports = services;