import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================
  // 1. CREATE DEFAULT ADMIN USER
  // ============================================
  console.log('Creating admin user...');

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

  console.log('✅ Admin created:', admin.email);
  console.log('📧 Email: admin@truongvietngu.com');
  console.log('🔑 Password: Admin123!');
  console.log('');

  // ============================================
  // 2. CREATE SITE SETTINGS
  // ============================================
  console.log('Creating site settings...');

  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: 'site_settings' },
    update: {},
    create: {
      id: 'site_settings',
      organizationName: 'Trường Việt Ngữ',
      subtitle: 'Thiếu Nhi Thánh Thể',
      location: 'Honolulu, HI',
      heroBackgroundColor: '#1e3a5f',
      welcomeMessage: 'Chào mừng đến với Trường Việt Ngữ Thiếu Nhi Thánh Thể. Chúng tôi cam kết giáo dục tiếng Việt và văn hóa Việt Nam cho thế hệ trẻ.',
      contactEmail: 'truongvietngu@example.com',
      contactPhone: '(808) 123-4567',
    },
  });

  console.log('✅ Site settings created');
  console.log('');

  // ============================================
  // 3. CREATE CLASSES
  // ============================================
  console.log('Creating classes...');

  const classes = await Promise.all([
    // Mẫu giáo classes
    prisma.class.create({
      data: {
        name: 'Lớp Mẫu Giáo A',
        gradeLevel: 'MAU_GIAO_A',
        teacherName: 'Cô Lan',
        schedule: 'Thứ Bảy 9:00 AM - 10:30 AM',
        roomNumber: 'Phòng 101',
        description: 'Lớp mẫu giáo cho trẻ 3-4 tuổi. Học chữ cái và từ vựng cơ bản.',
        isActive: true,
        displayOrder: 1,
      },
    }),
    prisma.class.create({
      data: {
        name: 'Lớp Mẫu Giáo B',
        gradeLevel: 'MAU_GIAO_B',
        teacherName: 'Cô Hoa',
        schedule: 'Thứ Bảy 9:00 AM - 10:30 AM',
        roomNumber: 'Phòng 102',
        description: 'Lớp mẫu giáo cho trẻ 4-5 tuổi. Học chữ cái, từ vựng và câu đơn giản.',
        isActive: true,
        displayOrder: 2,
      },
    }),
    prisma.class.create({
      data: {
        name: 'Lớp Mẫu Giáo C',
        gradeLevel: 'MAU_GIAO_C',
        teacherName: 'Cô Mai',
        schedule: 'Thứ Bảy 9:00 AM - 10:30 AM',
        roomNumber: 'Phòng 103',
        description: 'Lớp mẫu giáo cho trẻ 5-6 tuổi. Chuẩn bị cho lớp 1.',
        isActive: true,
        displayOrder: 3,
      },
    }),

    // Grade levels
    prisma.class.create({
      data: {
        name: 'Lớp 1',
        gradeLevel: 'LOP_1',
        teacherName: 'Thầy Nam',
        schedule: 'Thứ Bảy 10:45 AM - 12:15 PM',
        roomNumber: 'Phòng 201',
        description: 'Lớp 1 - Học đọc, viết và ngữ pháp cơ bản.',
        isActive: true,
        displayOrder: 4,
      },
    }),
    prisma.class.create({
      data: {
        name: 'Lớp 3',
        gradeLevel: 'LOP_3',
        teacherName: 'Cô Thu',
        schedule: 'Thứ Bảy 10:45 AM - 12:15 PM',
        roomNumber: 'Phòng 203',
        description: 'Lớp 3 - Học văn, thơ và văn hóa Việt Nam.',
        isActive: true,
        displayOrder: 5,
      },
    }),
  ]);

  console.log(`✅ Created ${classes.length} classes`);
  console.log('');

  // ============================================
  // 4. CREATE LEARNING MATERIALS
  // ============================================
  console.log('Creating learning materials...');

  const materials = await Promise.all([
    prisma.learningMaterial.create({
      data: {
        title: 'Tomathien.org - Lớp Mẫu Giáo',
        gradeLevel: 'MAU_GIAO_A',
        lessonNumbers: '1 + 21 17',
        externalLink: 'https://tomathien.org',
        description: 'Tài liệu học tiếng Việt cho lớp mẫu giáo từ Tomathien.org',
        isActive: true,
        displayOrder: 1,
      },
    }),
    prisma.learningMaterial.create({
      data: {
        title: 'Tomathien.org - Lớp 1',
        gradeLevel: 'LOP_1',
        lessonNumbers: '1 tới 16',
        externalLink: 'https://tomathien.org',
        description: 'Bài học tiếng Việt cho lớp 1 từ Tomathien.org',
        isActive: true,
        displayOrder: 2,
      },
    }),
    prisma.learningMaterial.create({
      data: {
        title: 'Tomathien.org - Lớp 3',
        gradeLevel: 'LOP_3',
        lessonNumbers: '1 tới 8',
        externalLink: 'https://tomathien.org',
        description: 'Bài học tiếng Việt cho lớp 3 từ Tomathien.org',
        isActive: true,
        displayOrder: 3,
      },
    }),
  ]);

  console.log(`✅ Created ${materials.length} learning materials`);
  console.log('');

  // ============================================
  // 5. CREATE ANNOUNCEMENTS
  // ============================================
  console.log('Creating announcements...');

  const announcements = await Promise.all([
    // Choir announcement
    prisma.announcement.create({
      data: {
        title: 'Ca đoàn TNTT - Hát cho ngày',
        description: 'Ca đoàn Thiếu Nhi Thánh Thể sẽ hát cho ngày lễ Giáng Sinh. Tất cả các em học sinh được mời tham gia tập hát.',
        category: 'CHOIR',
        startDate: new Date('2024-12-07'),
        endDate: new Date('2024-12-24'),
        priority: 10,
        isActive: true,
      },
    }),

    // Bible reading program
    prisma.announcement.create({
      data: {
        title: 'Chương Trình Đọc Sách Thánh - Tháng 12',
        description: 'Chương trình đọc Sách Thánh cho tháng 12. Các buổi học sẽ diễn ra vào các ngày 12 Dec và 19 Dec.',
        category: 'BIBLE',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-31'),
        priority: 9,
        isActive: true,
      },
    }),

    // General event
    prisma.announcement.create({
      data: {
        title: 'Thông Báo Lịch Học Mới',
        description: 'Lịch học cho năm học mới đã được cập nhật. Xin vui lòng kiểm tra thời gian biểu của lớp con em quý vị.',
        category: 'GENERAL',
        startDate: new Date(),
        priority: 5,
        isActive: true,
      },
    }),

    // Holiday announcement
    prisma.announcement.create({
      data: {
        title: 'Nghỉ Lễ Tết Nguyên Đán',
        description: 'Trường nghỉ lễ Tết Nguyên Đán từ ngày 28/01 đến 04/02. Chúc quý phụ huynh và các em học sinh năm mới vui vẻ, an khang thịnh vượng!',
        category: 'HOLIDAY',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-02-04'),
        priority: 8,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${announcements.length} announcements`);
  console.log('');

  // ============================================
  // SUMMARY
  // ============================================
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - ${1} admin user`);
  console.log(`   - ${classes.length} classes`);
  console.log(`   - ${materials.length} learning materials`);
  console.log(`   - ${announcements.length} announcements`);
  console.log(`   - ${1} site settings record`);
  console.log('');
  console.log('🔐 Admin Login Credentials:');
  console.log('   Email: admin@truongvietngu.com');
  console.log('   Password: Admin123!');
  console.log('');
  console.log('⚠️  IMPORTANT: Change the admin password after first login!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
