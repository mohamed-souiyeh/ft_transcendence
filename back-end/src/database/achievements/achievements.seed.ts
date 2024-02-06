
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    if ((await prisma.achievement.findMany()).length === 0)
    {
        await prisma.achievement.createMany({
            data:[
                {
                    name: 'newComer',
                    description: 'Played your first game ever',
                    image: 'url'
                },
                {
                    name: 'Player',
                    description: 'Played 5 matches',
                    image: 'url'
                },
                {
                    name: 'Veteran',
                    description: 'Played more than 5 and won 5 matches',
                    image: 'url'
                }
            ],
        });
    }
    console.log("Heeeeeeeeeeeeeeeeeeere");
}

main().catch((e) => {
        console.log("Error ", e);
        process.exit(1);
      }).finally(async () => {
        console.log("Success");
        await prisma.$disconnect();
      });

