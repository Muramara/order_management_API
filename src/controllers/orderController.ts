import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import { ApiResponseUtil } from '../utils/response';
import { CreateOrderInput, UpdateOrderInput, PaginationInput } from '../utils/validation';

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - productName
 *         - quantity
 *         - unitPrice
 *       properties:
 *         productName:
 *           type: string
 *           example: Laptop Computer
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         unitPrice:
 *           type: number
 *           format: float
 *           minimum: 0
 *           example: 999.99
 *     OrderInput:
 *       type: object
 *       required:
 *         - customerId
 *         - items
 *       properties:
 *         customerId:
 *           type: string
 *           example: clq1234567890
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *           example: PENDING
 *         notes:
 *           type: string
 *           example: Special delivery instructions
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 */

export class OrderController {
  /**
   * @swagger
   * /orders:
   *   post:
   *     summary: Create a new order
   *     tags: [Orders]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OrderInput'
   *     responses:
   *       201:
   *         description: Order created successfully
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
   *                   example: Order created successfully
   *                 data:
   *                   $ref: '#/components/schemas/Order'
   *       400:
   *         description: Validation error or customer not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData: CreateOrderInput = req.body;
      const order = await OrderService.createOrder(orderData);
      
      ApiResponseUtil.success(res, 'Order created successfully', order, 201);
    } catch (error) {
      ApiResponseUtil.error(res, 'Failed to create order', (error as Error).message);
    }
  }

  /**
   * @swagger
   * /orders:
   *   get:
   *     summary: List orders with pagination and filtering
   *     tags: [Orders]
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
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
   *         description: Filter by order status
   *       - in: query
   *         name: customerId
   *         schema:
   *           type: string
   *         description: Filter by customer ID
   *     responses:
   *       200:
   *         description: Orders retrieved successfully
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
   *                   example: Orders retrieved successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Order'
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
  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const pagination: PaginationInput = req.query as any;
      const filters = {
        status: req.query.status as string,
        customerId: req.query.customerId as string,
      };
      
      const result = await OrderService.getOrders(pagination, filters);
      
      ApiResponseUtil.success(
        res,
        'Orders retrieved successfully',
        result.orders,
        200,
        result.pagination
      );
    } catch (error) {
      ApiResponseUtil.error(res, 'Failed to retrieve orders', (error as Error).message);
    }
  }

  /**
   * @swagger
   * /orders/{id}:
   *   get:
   *     summary: Get order by ID
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Order retrieved successfully
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
   *                   example: Order retrieved successfully
   *                 data:
   *                   $ref: '#/components/schemas/Order'
   *       404:
   *         description: Order not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      
      ApiResponseUtil.success(res, 'Order retrieved successfully', order);
    } catch (error) {
      ApiResponseUtil.notFound(res, 'Order');
    }
  }

  /**
   * @swagger
   * /orders/{id}:
   *   put:
   *     summary: Update order
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Order ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
   *               notes:
   *                 type: string
   *               items:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/OrderItem'
   *     responses:
   *       200:
   *         description: Order updated successfully
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
   *                   example: Order updated successfully
   *                 data:
   *                   $ref: '#/components/schemas/Order'
   *       404:
   *         description: Order not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateOrderInput = req.body;
      const order = await OrderService.updateOrder(id, updateData);
      
      ApiResponseUtil.success(res, 'Order updated successfully', order);
    } catch (error) {
      ApiResponseUtil.notFound(res, 'Order');
    }
  }

  /**
   * @swagger
   * /orders/{id}:
   *   delete:
   *     summary: Delete order
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Order deleted successfully
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
   *                   example: Order deleted successfully
   *       404:
   *         description: Order not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await OrderService.deleteOrder(id);
      
      ApiResponseUtil.success(res, 'Order deleted successfully');
    } catch (error) {
      ApiResponseUtil.notFound(res, 'Order');
    }
  }
}