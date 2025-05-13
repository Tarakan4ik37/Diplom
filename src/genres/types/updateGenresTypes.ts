import { Genres } from '@prisma/client';

export type GenresUpdateRequest = {
    Params: {
        id: number;
    };
    Body: Partial<Pick<Genres, 'name'>>;
};

export type GenresUpdateResponse = { success: true };
