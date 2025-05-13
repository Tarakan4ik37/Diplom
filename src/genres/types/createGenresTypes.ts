import { Genres } from '@prisma/client';

export type GenresCreateRequest = {
    Body: Pick<Genres, 'name'>;
};

export type GenresCreateResponse = { id: number };
