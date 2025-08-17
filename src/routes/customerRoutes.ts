import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';
import { authenticateToken } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validation';
import { createCustomerSchema, updateCustomerSchema, paginationSchema } from '../utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.post('/', validateBody(createCustomerSchema), CustomerController.createCustomer);
router.get('/', validateQuery(paginationSchema), CustomerController.getCustomers);
router.get('/:id', CustomerController.getCustomerById);
router.put('/:id', validateBody(updateCustomerSchema), CustomerController.updateCustomer);
router.delete('/:id', CustomerController.deleteCustomer);

export default router;