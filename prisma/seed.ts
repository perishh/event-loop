import "dotenv/config";
import { hash } from "bcryptjs";
import prisma from "../lib/prisma";
import { UserRole } from "../app/generated/prisma/enums";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin1234";

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { username: ADMIN_USERNAME },
    select: { id: true },
  });

  if (existingAdmin) {
    console.log("Ο διαχειριστής υπάρχει ήδη — παράλειψη.");
    return;
  }

  const hashedPassword = await hash(ADMIN_PASSWORD, 12);

  await prisma.user.create({
    data: {
      firstName: "Διαχειριστής",
      lastName: "Συστήματος",
      username: ADMIN_USERNAME,
      email: "admin@eventloop.local",
      hash: hashedPassword,
      role: UserRole.ADMIN,
      afm: "000000000",
      area: "—",
      city: "—",
      country: "—",
      approved: true,
    },
  });

  console.log(`Ο διαχειριστής δημιουργήθηκε (username: ${ADMIN_USERNAME}).`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
