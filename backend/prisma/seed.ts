import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@aquaops.local' },
    update: {
      firstName: 'Aqua',
      lastName: 'Admin',
      passwordHash,
    },
    create: {
      firstName: 'Aqua',
      lastName: 'Admin',
      email: 'admin@aquaops.local',
      passwordHash,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
