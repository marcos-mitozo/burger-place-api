import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';

import * as schema from './prisma/schema.prisma';
import * as x from './node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node';
import * as l from './node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node';

import IOrder from './models/order';
import IMeal from './models/meal';

if (process.env.NODE_ENV !== 'production') {
    console.debug(schema, x, l);
}

const prisma = new PrismaClient();

export const placeOrder = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const order: IOrder = JSON.parse(event.body || '');
    let meal: IMeal | null;

    try {
        meal = await prisma.meal.findUnique({
            where: { id: order.mealId },
            include: { ingredients: { orderBy: { ingredientId: 'desc' } } },
        });

        if (!meal) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'We could not find the requested hamburger. Perhaps its no longer part of our menu?',
                }),
            };
        } else {
            const requiredIngredients = meal.ingredients.map((ingredient: any) => ({
                id: ingredient.ingredientId,
                quantity: ingredient.quantity * order.quantity,
            }));

            const requiredIngredientsIds = requiredIngredients.map((requiredIngredient: any) => requiredIngredient.id);

            const ingredients = await prisma.ingredient.findMany({
                where: { id: { in: [...requiredIngredientsIds] } },
            });

            const mergedIngredients = ingredients.map((ingredient: any) => {
                const required = requiredIngredients.find(
                    (requiredIngredient: any) => ingredient.id === requiredIngredient.id,
                );

                return { ...ingredient, requiredQuantity: required.quantity };
            });

            if (mergedIngredients.some((ingredient: any) => ingredient.quantity < ingredient.requiredQuantity)) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message:
                            'Sorry, we cannot make this one right now due to lack of ingredients, please, kindly choose another one :)',
                    }),
                };
            } else {
                mergedIngredients.forEach(async (ingredient: any) => {
                    await prisma.ingredient.update({
                        data: { quantity: { decrement: ingredient.requiredQuantity } },
                        where: { id: ingredient.id },
                    });
                });

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Your order was successfully placed, you will receive your delicious hamburger soon!',
                    }),
                };
            }
        }
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `An error has ocurred while searching for the ordered meal: ${err}`,
            }),
        };
    }
};
