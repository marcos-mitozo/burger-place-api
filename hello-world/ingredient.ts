import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';

import IIngredient from "./models/ingredient";

export const createIngredient = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const prisma = new PrismaClient();
    const ingredient: IIngredient = JSON.parse(event.body || '');

    try {
    const newIngredient = await prisma.ingredient.create({data: {...ingredient}});
        return {
            statusCode: 201,
            body: JSON.stringify({
                newIngredient
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `An error has ocurred while saving the new ingredient: ${err}`,
            }),
        };
    }
}

export const listIngredients = async () => {
    const prisma = new PrismaClient();
    return await prisma.ingredient.findMany();
}