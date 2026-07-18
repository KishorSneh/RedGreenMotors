import { Router } from 'express';
import {
  getAllVehicles,
  searchVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from '../controllers/vehicle.controller';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/search', verifyToken, searchVehicles);
router.get('/', verifyToken, getAllVehicles);
router.get('/:id', verifyToken, getVehicleById);

router.post('/', verifyToken, requireAdmin, createVehicle);
router.put('/:id', verifyToken, requireAdmin, updateVehicle);
router.delete('/:id', verifyToken, requireAdmin, deleteVehicle);
router.post('/:id/restock', verifyToken, requireAdmin, restockVehicle);

router.post('/:id/purchase', verifyToken, purchaseVehicle);

export default router;
