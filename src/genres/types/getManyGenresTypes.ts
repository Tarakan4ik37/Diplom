import { Genres } from '@prisma/client';

export type GenresGetManyRequest = {
    Querystring: {
        page: number;
        limit: number;
        search?: string;
        isDescending?: boolean;
    };
};

export type GenresGetManyResponse = Pick<Genres, 'id' | 'name'>[];
