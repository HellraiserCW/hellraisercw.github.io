const { Truck } = require('../models/Truck');

const createTruck = async (req, res, next) => {
  const { type } = req.body;
  let payload;
  let width;
  let length;
  let height;
  switch (type) {
    case 'SPRINTER':
      payload = 1700;
      width = 250;
      length = 300;
      height = 170;
      break;
    case 'SMALL STRAIGHT':
      payload = 2500;
      width = 250;
      length = 500;
      height = 170;
      break;
    case 'LARGE STRAIGHT':
      payload = 4000;
      width = 350;
      length = 700;
      height = 200;
      break;
    default:
      payload = 1700;
      width = 250;
      length = 300;
      height = 170;
  }
  const truck = new Truck({
    created_by: req.userProfile._id,
    type,
    created_date: new Date().toISOString(),
    payload,
    dimensions: {
      width,
      length,
      height,
    },
  });

  await truck.save()
    .catch((err) => {
      next(err);
    });
  res.status(200).json({ message: 'Truck created successfully' });
};

const getUserTrucks = async (req, res) => {
  if (req.userProfile.role === 'DRIVER') {
    const trucks = await Truck.find({ created_by: req.userProfile._id });
    res.status(200).json({ trucks });
  } else {
    res.status(400).json({ message: 'Access denied!' });
  }
};

const getUserTruckById = async (req, res) => {
  const truck = await Truck.findById(req.params.id);
  res.status(200).json({ truck });
};

const assignTruck = async (req, res, next) => {
  const truck = await Truck.findById(req.params.id);

  const assigned = await Truck.findOne({ assigned_to: req.userProfile._id });

  if (truck.status === 'IS' && (!assigned || assigned.status === 'IS')) {
    if (assigned) {
      assigned.assigned_to = null;
      assigned.save().catch((err) => {
        next(err);
      });
    }

    truck.assigned_to = req.userProfile._id;
    truck.save()
      .catch((err) => {
        next(err);
      });

    res.status(200).json({ message: 'Truck assigned successfully' });
  } else if (truck.status === 'IS' && assigned.status !== 'IS') {
    res.status(400).json({ message: 'Another assigned to you truck is on load' });
  } else {
    res.status(400).json({ message: 'Truck is on load and can`t be assigned' });
  }
};

const updateTruck = async (req, res, next) => {
  const { type } = req.body;
  const truck = await Truck.findById(req.params.id);

  if (!truck.assigned_to) {
    let payload;
    let width;
    let length;
    let height;
    switch (type) {
      case 'SPRINTER':
        payload = 1700;
        width = 250;
        length = 300;
        height = 170;
        break;
      case 'SMALL STRAIGHT':
        payload = 2500;
        width = 250;
        length = 500;
        height = 170;
        break;
      case 'LARGE STRAIGHT':
        payload = 4000;
        width = 350;
        length = 700;
        height = 200;
        break;
      default:
        payload = 1700;
        width = 250;
        length = 300;
        height = 170;
    }
    truck.type = type;
    truck.payload = payload;
    truck.dimensions.width = width;
    truck.dimensions.length = length;
    truck.dimensions.height = height;

    truck.save()
      .catch((err) => {
        next(err);
      });
    return res.status(200).json({ message: 'Truck details changed successfully' });
  }
  return res.status(400).json({ message: 'Truck is assigned and can`t be updated' });
};

const deleteTruck = async (req, res) => {
  const truck = await Truck.findById(req.params.id);

  if (!truck.assigned_to) {
    try {
      await Truck.findByIdAndDelete(req.params.id);

      return res.status(200).json({ message: 'Truck deleted successfully' });
    } catch (err) {
      return console.error(err);
    }
  }
  return res.status(400).json({ message: 'Truck is assigned and can`t be deleted' });
};

module.exports = {
  createTruck,
  getUserTrucks,
  getUserTruckById,
  assignTruck,
  updateTruck,
  deleteTruck,
};
