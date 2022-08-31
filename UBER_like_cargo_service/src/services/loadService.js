const { Load } = require('../models/Load');
const { Truck } = require('../models/Truck');

const createLoad = async (req, res, next) => {
  const {
    name,
    payload,
    pickup_address,
    delivery_address,
    dimensions: {
      width,
      length,
      height,
    },
  } = req.body;
  const load = new Load({
    created_by: req.userProfile._id,
    name,
    payload,
    pickup_address,
    delivery_address,
    dimensions: {
      width,
      length,
      height,
    },
    created_date: new Date().toISOString(),
  });

  await load.save()
    .catch((err) => {
      next(err);
    });
  res.status(200).json({ message: 'Load created successfully' });
};

const getUserLoads = async (req, res) => {
  const loads = await Load.find({ created_by: req.userProfile._id });
  res.status(200).json({ loads });
};

const getUserLoadById = async (req, res) => {
  const load = await Load.findById(req.params.id);
  res.status(200).json({ load });
};

const updateLoad = async (req, res, next) => {
  const load = await Load.findById(req.params.id);

  if (load.status === 'NEW') {
    const {
      name,
      payload,
      pickup_address,
      delivery_address,
      dimensions: {
        width,
        length,
        height,
      },
    } = req.body;
    if (name) {
      load.name = name;
    }
    if (payload) {
      load.payload = payload;
    }
    if (pickup_address) {
      load.pickup_address = pickup_address;
    }
    if (delivery_address) {
      load.delivery_address = delivery_address;
    }
    if (width) {
      load.width = width;
    }
    if (length) {
      load.length = length;
    }
    if (height) {
      load.height = height;
    }
    load.save()
      .catch((err) => {
        next(err);
      });

    return res.status(200).json({ message: 'Load details changed successfully' });
  }
  return res.status(400).json({ message: 'Load is posted and can`t be changed' });
};

const deleteLoad = async (req, res) => {
  const load = await Load.findById(req.params.id);

  if (load.status === 'NEW') {
    try {
      await Load.findByIdAndDelete(req.params.id);

      return res.status(200).json({ message: 'Load deleted successfully' });
    } catch (err) {
      return console.error(err);
    }
  }
  return res.status(400).json({ message: 'Load is posted and can`t be deleted' });
};

const postLoad = async (req, res, next) => {
  const load = await Load.findById(req.params.id);
  if (load.status !== 'NEW') {
    return res.status(400).json({ message: 'Load already posted' });
  }
  load.status = 'POSTED';
  const isTrucks = await Truck.find({
    status: 'IS',
    assigned_to: { $ne: null },
    payload: { $gte: load.payload },
    width: { $gte: load.dimensions.width },
    length: { $gte: load.dimensions.length },
    height: { $gte: load.dimensions.height },
  });

  if (isTrucks.length === 0) {
    load.status = 'NEW';
    load.logs.push({ message: 'Truck for your load currently not found', time: new Date().toISOString() });

    load.save()
      .catch((err) => {
        next(err);
      });
    return res.status(400).json({ message: 'Truck for your load currently not found' });
  }
  const orderedTruck = isTrucks[Math.floor(Math.random() * isTrucks.length)];
  orderedTruck.status = 'OL';

  orderedTruck.save()
    .catch((err) => {
      next(err);
    });

  load.status = 'ASSIGNED';
  load.state = 'En route to Pick Up';
  load.assigned_to = orderedTruck.assigned_to;
  load.logs.push({ message: `Load assigned to driver with id ${orderedTruck.assigned_to}`, time: new Date().toISOString() });

  load.save()
    .catch((err) => {
      next(err);
    });
  return res.status(200).json({ message: 'Load posted successfully', driver_found: true });
};

const shippingInfoLoad = async (req, res) => {
  const load = await Load.findById(req.params.id);
  const truck = await Truck.findOne({ assigned_to: load.assigned_to });
  res.status(200).json({
    load,
    // : {
    //   _id: load.id,
    //   created_by: load.created_by,
    //   assigned_to: load.assigned_to,
    //   status: load.status,
    //   state: load.state,
    //   name: load.name,
    //   payload: load.payload,
    //   pickup_address: load.pickup_address,
    //   delivery_address: load.delivery_address,
    //   dimensions: {
    //     width: load.dimensions.width,
    //     length: load.dimensions.length,
    //     height: load.dimensions.height,
    //   },
    //   logs: load.logs,
    //   created_date: load.created_date,
    // },
    truck,
    // : {
    //   _id: truck._id,
    //   created_by: truck.created_by,
    //   assigned_to: truck.assigned_to,
    //   type: truck.type,
    //   status: truck.status,
    //   created_date: truck.created_date,
    // },
  });
};

const getUserActiveLoad = async (req, res) => {
  if (req.userProfile.role === 'DRIVER') {
    const load = await Load.findOne({ assigned_to: req.userProfile._id, status: 'ASSIGNED' });
    res.status(200).json({
      load,
      // : {
      //   _id: load.id,
      //   created_by: load.created_by,
      //   assigned_to: load.assigned_to,
      //   status: load.status,
      //   state: load.state,
      //   name: load.name,
      //   payload: load.payload,
      //   pickup_address: load.pickup_address,
      //   delivery_address: load.delivery_address,
      //   dimensions: {
      //     width: load.dimensions.width,
      //     length: load.dimensions.length,
      //     height: load.dimensions.height,
      //   },
      //   logs: load.logs,
      //   created_date: load.created_date,
      // },
    });
  } else {
    res.status(400).json({ message: 'Access denied!' });
  }
};

const iterateLoadState = async (req, res, next) => {
  if (req.userProfile.role === 'DRIVER') {
    const load = await Load.findOne({ assigned_to: req.userProfile._id, status: 'ASSIGNED' });
    const truck = await Truck.findOne({ assigned_to: load.assigned_to });
    if (load.state === 'En route to delivery') {
      load.state = 'Arrived to delivery';
      load.status = 'SHIPPED';
      load.logs.push({ message: 'Load arrived to delivery', time: new Date().toISOString() });
      truck.status = 'IS';
      load.save()
        .catch((err) => {
          next(err);
        });
      truck.save()
        .catch((err) => {
          next(err);
        });
      res.status(200).json({ message: "Load state changed to 'Arrived to delivery'" });
    } else if (load.state === 'Arrived to Pick Up') {
      load.state = 'En route to delivery';
      load.logs.push({ message: 'Load en route to delivery', time: new Date().toISOString() });
      load.save()
        .catch((err) => {
          next(err);
        });
      res.status(200).json({ message: "Load state changed to 'En route to Delivery'" });
    } else if (load.state === 'En route to Pick Up') {
      load.state = 'Arrived to Pick Up';
      load.logs.push({ message: 'Driver arrived to Pick Up load', time: new Date().toISOString() });
      load.save()
        .catch((err) => {
          next(err);
        });
      res.status(200).json({ message: "Load state changed to 'Arrived to Pick Up'" });
    } else {
      res.status(400).json({ message: 'Load already arrived to delivery' });
    }
  } else {
    res.status(400).json({ message: 'Access denied!' });
  }
};

module.exports = {
  createLoad,
  getUserLoads,
  getUserLoadById,
  updateLoad,
  deleteLoad,
  postLoad,
  shippingInfoLoad,
  getUserActiveLoad,
  iterateLoadState,
};
