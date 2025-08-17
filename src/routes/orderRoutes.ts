import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticateToken } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validation';
import { createOrderSchema, updateOrderSchema, paginationSchema } from '../utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.post('/', validateBody(createOrderSchema), OrderController.createOrder);
router.get('/', validateQuery(paginationSchema), OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id', validateBody(updateOrderSchema), OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);

export default router;