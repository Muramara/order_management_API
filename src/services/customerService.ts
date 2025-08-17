import prisma from '../config/database';
import { CreateCustomerInput, UpdateCustomerInput, PaginationInput } from '../utils/validation';

export class CustomerService {
  static async createCustomer(data: CreateCustomerInput) {
    return prisma.customer.create({
      data,
    });
  }

  static async getCustomers(pagination: PaginationInput) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { orders: true },
          },
        },
      }),
      prisma.customer.count(),
    ]);

    return {
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: true,
          },
        },
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  }

  static async updateCustomer(id: string, data: UpdateCustomerInput) {
    try {
      return await prisma.customer.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error('Customer not found');
    }
  }

  static async deleteCustomer(id: string) {
    try {
      // Check if customer has orders
      const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
          _count: {
            select: { orders: true },
          },
        },
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Delete customer (orders will be cascade deleted due to schema)
      await prisma.customer.delete({
        where: { id },
      });

      return { deletedOrdersCount: customer._count.orders };
    } catch (error) {
      throw new Error('Customer not found');
    }
  }
}