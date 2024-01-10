interface IIngredient {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    quantity: number;
}

export default IIngredient;