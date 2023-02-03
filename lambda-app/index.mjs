import { PrismaClient } from '@prisma/client'

export const handler = async(event) => {
    const client = new PrismaClient()
    const result = await client.$queryRaw`SELECT 'meowmeow'`
    const response = {
        statusCode: 200,
        body: JSON.stringify(result),
    };
    return response;
};

