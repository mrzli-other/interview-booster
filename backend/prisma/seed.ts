import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const vehicleInfos = require('./data/vehicle-info.json');
  for (const item of vehicleInfos) {
    await prisma.vehicleInfo.create({ data: item });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
