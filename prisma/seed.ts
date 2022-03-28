import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "juliana@uma.ni";
  const pfAlias = "my-first-portfolio";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(e => {
    console.log(e)
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("thisisapassword", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  // cleanup the existing portfolio
  await prisma.portfolio.delete({ where: { alias: pfAlias }}).catch(() => {})

  const portfolio = await prisma.portfolio.create({
    data: {
      name: "My first Portfolio",
      alias: pfAlias,
      description: "This is a portfolio",
      user: {
        connect: { id: user.id },
      }
    },
  });

  await prisma.product.create({
    data: {
      name: "Wooden Table",
      description: "This is a table",
      alias: "table-table-wood",
      portfolioId: portfolio.id,
      price: 200000,
    }
  })

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
