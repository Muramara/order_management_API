import { PrismaClient } from '@prisma/client';
import { AuthUtil } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
    const hashedPassword = await AuthUtil.hashPassword(adminPassword);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
      },
    });
    
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
  }

  // Create sample customers
  const customers = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      address: '123 Main St, New York, NY 10001',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1987654321',
      address: '456 Oak Ave, Los Angeles, CA 90210',
    },
    {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1555123456',
      address: '789 Pine St, Chicago, IL 60601',
    },
  ];

  for (const customerData of customers) {
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: customerData.email },
    });

    if (!existingCustomer) {
      const customer = await prisma.customer.create({
        data: customerData,
      });

      // Create sample orders for each customer
      const orderCount = Math.floor(Math.random() * 3) + 1; // 1-3 orders per customer
      
      for (let i = 0; i < orderCount; i++) {
        const orderNumber = `ORD-2024-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
        const items = [
          {
            productName: 'Laptop Computer',
            quantity: 1,
            unitPrice: 999.99,
            totalPrice: 999.99,
          },
          {
            productName: 'Wireless Mouse',
            quantity: 2,
            unitPrice: 29.99,
            totalPrice: 59.98,
          },
        ];

        const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        await prisma.order.create({
          data: {
            orderNumber,
            status: randomStatus as any,
            totalAmount,
            notes: 'Sample order created during seeding',
            customerId: customer.id,
            items: {
              create: items,
            },
          },
        });
      }

      console.log(`✅ Customer created: ${customerData.firstName} ${customerData.lastName} with ${orderCount} orders`);
    } else {
      console.log(`ℹ️  Customer already exists: ${customerData.email}`);
    }
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });