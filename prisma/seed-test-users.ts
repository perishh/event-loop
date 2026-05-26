import "dotenv/config";
import { hash } from "bcryptjs";
import prisma from "../lib/prisma";
import { UserRole } from "../app/generated/prisma/enums";

const TEST_USER_COUNT = 15;
const TEST_PASSWORD = "test1234";

async function main() {
  const hashedPassword = await hash(TEST_PASSWORD, 12);

  const users = Array.from({ length: TEST_USER_COUNT }, (_, index) => {
    const n = index + 1;
    return {
      firstName: `Όνομα${n}`,
      lastName: `Επώνυμο${n}`,
      username: `user${n}`,
      email: `user${n}@test.local`,
      hash: hashedPassword,
      role: n % 2 === 0 ? UserRole.ORGANIZER : UserRole.ATTENDEE,
      afm: String(100000000 + n),
      area: "Κέντρο",
      city: "Αθήνα",
      country: "Ελλάδα",
      approved: false,
    };
  });

  const result = await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log(`Δημιουργήθηκαν ${result.count} δοκιμαστικοί χρήστες.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
