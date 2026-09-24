const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with test users...');

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('password123', saltRounds);

  const users = [
    {
      name: 'Alex Morgan',
      email: 'alex.dev@taskflow.com',
      password_hash: passwordHash,
    },
    {
      name: 'Test User',
      email: 'test@example.com',
      password_hash: passwordHash,
    },
  ];

  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existing) {
      await prisma.user.create({
        data: user,
      });
      console.log(`Created user: ${user.email}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
