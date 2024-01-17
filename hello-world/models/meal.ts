interface IMeal {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    description: string;
    ingredients?: any;
}

export default IMeal;