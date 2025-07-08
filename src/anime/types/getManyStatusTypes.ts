import { Anime, Genres, $Enums } from '@prisma/client';

export type StatusGetByRequest = {
    Querystring: {
        page: number;
        limit: number;
        search?: string;
        status?: $Enums.StatusViewingUser;
    };
};

export type StatusGetManyResponse = (Pick<
    Anime,
    | 'id'
    | 'name'
    | 'type'
    | 'posterURl'
    | 'averageRating'
    | 'description'
    | 'releaseDate'
> & {
    genres: Genres[];
})[];
