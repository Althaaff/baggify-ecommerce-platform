import express from "express";

// implement auth middleware :
import { protect } from "../../middleware/auth.middleware.js";
import {
  createAddress,
  deleteAddress,
  deleteAllAddress,
  getAddressById,
  getAllAddresses,
  setDefaultAddress,
  updateAddress,
} from "../../controllers/user/address.controller.js";

// apply the authentication middleware to all the routes :
const router = express.Router();

router.use(protect);

// routes :
router.route("/addresses").get(getAllAddresses).post(createAddress);

router.route("/addresses/all").delete(deleteAllAddress);

router
  .route("/addresses/:id")
  .get(getAddressById)
  .put(updateAddress)
  .delete(deleteAddress);

router.patch("/addresses/:id/default", setDefaultAddress);

export default router;
