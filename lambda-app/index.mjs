import { PrismaClient } from '@prisma/client'

const coldstart = true
const client = new PrismaClient()

export const handler = async(event) => {
    const result = await client.$queryRaw`SELECT 'meowmeow'`
    const response = {
        statusCode: 200,
        body: JSON.stringify(result),
    };
    console.log({ coldstart })
    coldstart = false
    return response;
};

