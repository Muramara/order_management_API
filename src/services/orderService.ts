import prisma from '../config/database';
import { CreateOrderInput, UpdateOrderInput, PaginationInput } from '../utils/validation';

export class OrderService {
  static async createOrder(data: CreateOrderInput) {
    const { customerId, items, status = 'PENDING', notes } = data;

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      return sum + itemTotal;
    }, 0);

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(6, '0')}`;

    // Create order with items
    return prisma.order.create({
      data: {
        orderNumber,
        status,
        totalAmount,
        notes,
        customerId,
        items: {
          create: items.map(item => ({
            ...item,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });
  }

  static async getOrders(pagination: PaginationInput, filters?: { status?: string; customerId?: string }) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          items: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  static async updateOrder(id: string, data: UpdateOrderInput) {
    const { items, ...orderData } = data;

    try {
      // If items are provided, we need to replace them
      if (items) {
        const totalAmount = items.reduce((sum, item) => {
          return sum + (item.quantity * item.unitPrice);
        }, 0);

        return await prisma.order.update({
          where: { id },
          data: {
            ...orderData,
            totalAmount,
            items: {
              deleteMany: {},
              create: items.map(item => ({
                ...item,
                totalPrice: item.quantity * item.unitPrice,
              })),
            },
          },
          include: {
            customer: true,
            items: true,
          },
        });
      }

      // Update order without changing items
      return await prisma.order.update({
        where: { id },
        data: orderData,
        include: {
          customer: true,
          items: true,
        },
      });
    } catch (error) {
      throw new Error('Order not found');
    }
  }

  static async deleteOrder(id: string) {
    try {
      await prisma.order.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error('Order not found');
    }
  }
}