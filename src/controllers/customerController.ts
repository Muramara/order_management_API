import { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';
import { ApiResponseUtil } from '../utils/response';
import { CreateCustomerInput, UpdateCustomerInput, PaginationInput } from '../utils/validation';

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         phone:
 *           type: string
 *           example: +1234567890
 *         address:
 *           type: string
 *           example: 123 Main St, City, State 12345
 */

export class CustomerController {
  /**
   * @swagger
   * /customers:
   *   post:
   *     summary: Create a new customer
   *     tags: [Customers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CustomerInput'
   *     responses:
   *       201:
   *         description: Customer created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Customer created successfully
   *                 data:
   *                   $ref: '#/components/schemas/Customer'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerData: CreateCustomerInput = req.body;
      const customer = await CustomerService.createCustomer(customerData);
      
      ApiResponseUtil.success(res, 'Customer created successfully', customer, 201);
    } catch (error) {
      ApiResponseUtil.error(res, 'Failed to create customer', (error as Error).message);
    }
  }

  /**
   * @swagger
   * /customers:
   *   get:
   *     summary: List customers with pagination
   *     tags: [Customers]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: Customers retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Customers retrieved successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Customer'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     total:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   */
  static async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      const pagination: PaginationInput = req.query as any;
      const result = await CustomerService.getCustomers(pagination);
      
      ApiResponseUtil.success(
        res,
        'Customers retrieved successfully',
        result.customers,
        200,
        result.pagination
      );
    } catch (error) {
      ApiResponseUtil.error(res, 'Failed to retrieve customers', (error as Error).message);
    }
  }

  /**
   * @swagger
   * /customers/{id}:
   *   get:
   *     summary: Get customer by ID
   *     tags: [Customers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Customer ID
   *     responses:
   *       200:
   *         description: Customer retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Customer retrieved successfully
   *                 data:
   *                   $ref: '#/components/schemas/Customer'
   *       404:
   *         description: Customer not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async getCustomerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const customer = await CustomerService.getCustomerById(id);
      
      ApiResponseUtil.success(res, 'Customer retrieved successfully', customer);
    } catch (error) {
      ApiResponseUtil.notFound(res, 'Customer');
    }
  }

  /**
   * @swagger
   * /customers/{id}:
   *   put:
   *     summary: Update customer
   *     tags: [Customers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Customer ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CustomerInput'
   *     responses:
   *       200:
   *         description: Customer updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Customer updated successfully
   *                 data:
   *                   $ref: '#/components/schemas/Customer'
   *       404:
   *         description: Customer not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateCustomerInput = req.body;
      const customer = await CustomerService.updateCustomer(id, updateData);
      
      ApiResponseUtil.success(res, 'Customer updated successfully', customer);
    } catch (error) {
      ApiResponseUtil.notFound(res, 'Customer');
    }
  }

  /**
   * @swagger
   * /customers/{id}:
   *   delete:
   *     summary: Delete customer
   *     tags: [Customers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Customer ID
   *     responses:
   *       200:
   *         description: Customer deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Customer and 3 associated orders deleted successfully
   *       404:
   *         description: Customer not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await CustomerService.deleteCustomer(id);
      
      const message = result.deletedOrdersCount > 0
        ? `Customer and ${result.deletedOrdersCount} associated orders deleted successfully`
        : 'Customer deleted successfully';
        
      ApiResponseUtil.success(res, message);
    } catch (error) {
      ApiResponseUtil.notFound(res, 'Customer');
    }
  }
}