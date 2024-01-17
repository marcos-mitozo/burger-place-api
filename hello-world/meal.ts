import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';

import IMeal from './models/meal';

import * as schema from './prisma/schema.prisma';
import * as x from './node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node';
import * as l from './node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node';

if (process.env.NODE_ENV !== 'production') {
    console.debug(schema, x, l);
}

const prisma = new PrismaClient();

export const createMeal = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const meal: IMeal = JSON.parse(event.body || '');

    meal.ingredients = {
        create: meal.ingredients.map((ingredient: any) => ({
            assignedBy: meal.name,
            assignedAt: new Date(),
            quantity: ingredient.quantity,
            ingredient: { connect: { id: ingredient.id } },
        })),
    };

    try {
        const newMeal = await prisma.meal.create({ data: { ...meal } });
        return {
            statusCode: 201,
            body: JSON.stringify({
                ...newMeal,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `An error has ocurred while saving the new meal: ${err}`,
            }),
        };
    }
};

export const listMeals = async () => {
    let meals: IMeal[];

    try {
        meals = await prisma.meal.findMany();
        return {
            statusCode: 200,
            body: JSON.stringify([...meals]),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `An error has ocurred while saving the new meal: ${err}`,
            }),
        };
    }
};
