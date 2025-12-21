import { PrismaClient, GradeLevel, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type ClassCreateInput = Prisma.ClassCreateInput;

async function main() {
  console.log('Adding new Vietnamese language and TNTT classes...');

  // Vietnamese Language Classes (Lớp 1-7)
  const vietnameseClasses = [
    {
      name: 'Lớp 1',
      gradeLevel: 'LOP_1',
      schedule: 'Chủ Nhật 9:00 AM - 12:00 PM',
      description: 'Lớp tiếng Việt cho học sinh khoảng 7-9 tuổi',
      displayOrder: 4,
    },
    {
      name: 'Lớp 2',
      gradeLevel: 'LOP_2',
      schedule: 'Chủ Nhật 9:00 AM - 12:00 PM',
      description: 'Lớp tiếng Việt cho học sinh khoảng 10-12 tuổi',
      displayOrder: 5,
    },
    {
      name: 'Lớp 3',
      gradeLevel: 'LOP_3',
      schedule: 'Chủ Nhật 9:00 AM - 12:00 PM',
      description: 'Lớp tiếng Việt cho học sinh khoảng 13-15 tuổi',
      displayOrder: 6,
    },
    {
      name: 'Lớp 4',
      gradeLevel: 'LOP_4',
      schedule: 'Chủ Nhật 9:00 AM - 12:00 PM',
      description: 'Lớp tiếng Việt cho học sinh khoảng 16-18 tuổi (Lớp trưởng)',
      displayOrder: 7,
    },
    {
      name: 'Lớp 5',
      gradeLevel: 'LOP_5',
      schedule: 'Chủ Nhật 9:00 AM - 12:00 PM',
      description: 'Lớp tiếng Việt nâng cao',
      displayOrder: 8,
    },
    {
      name: 'Lớp 6',
      gradeLevel: 'LOP_6',
      schedule: 'Chủ Nhật 9:00 AM - 12:00 PM',
      description: 'Lớp tiếng Việt nâng cao',
      displayOrder: 9,
    },
    {
      name: 'Lớp 7',
      gradeLevel: 'LOP_7',
      schedule: 'Chủ Nhật 9:00 AM - 12:00 PM',
      description: 'Lớp tiếng Việt nâng cao',
      displayOrder: 10,
    },
  ];

  // TNTT Classes
  const tnttClasses = [
    {
      name: 'Ngành Ấu Nhi',
      gradeLevel: 'AU_NHI',
      schedule: 'Chủ Nhật 9:00 AM - 12:00 PM',
      description: 'TNTT cho các em khoảng 7-9 tuổi. Làm quen với đức tin Công Giáo qua các hoạt động vui chơi',
      displayOrder: 11,
      classroomImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    },
    {
      name: 'Ngành Thiếu Nhi',
      gradeLevel: 'THIEU_NHI',
      schedule: 'Chủ Nhật 9:00 AM - 12:00 PM',
      description: 'TNTT cho các em khoảng 10-12 tuổi. Phát triển đức tin qua các hoạt động nhóm',
      displayOrder: 12,
      classroomImage: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
    },
    {
      name: 'Ngành Nghĩa Sĩ',
      gradeLevel: 'NGHIA_SI',
      schedule: 'Chủ Nhật 9:00 AM - 12:00 PM',
      description: 'TNTT cho các em khoảng 13-15 tuổi. Rèn luyện đức tin và tinh thần phục vụ',
      displayOrder: 13,
      classroomImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    },
    {
      name: 'Ngành Hiệp Sĩ',
      gradeLevel: 'HIEP_SI',
      schedule: 'Chủ Nhật 9:00 AM - 12:00 PM',
      description: 'TNTT cho các em khoảng 16-18 tuổi. Trở thành lãnh đạo và gương mẫu',
      displayOrder: 14,
      classroomImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
    },
  ];

  // Create Vietnamese classes
  for (const classData of vietnameseClasses) {
    const existing = await prisma.class.findFirst({
      where: { gradeLevel: classData.gradeLevel as GradeLevel },
    });

    if (!existing) {
      await prisma.class.create({
        data: classData as ClassCreateInput,
      });
      console.log(`✓ Created ${classData.name}`);
    } else {
      console.log(`- ${classData.name} already exists`);
    }
  }

  // Create TNTT classes
  for (const classData of tnttClasses) {
    const existing = await prisma.class.findFirst({
      where: { gradeLevel: classData.gradeLevel as GradeLevel },
    });

    if (!existing) {
      await prisma.class.create({
        data: classData as ClassCreateInput,
      });
      console.log(`✓ Created ${classData.name}`);
    } else {
      console.log(`- ${classData.name} already exists`);
    }
  }

  console.log('\n✅ Done! All classes created successfully.');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
