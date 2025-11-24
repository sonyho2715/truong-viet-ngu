import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    const admin = await prisma.admin.upsert({
      where: { email: 'admin@truongvietngu.com' },
      update: {},
      create: {
        email: 'admin@truongvietngu.com',
        password: hashedPassword,
        name: 'Administrator',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@truongvietngu.com');
    console.log('🔑 Password: Admin123!');
    console.log('');
    console.log('You can now login at: http://localhost:3000/admin/login');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
