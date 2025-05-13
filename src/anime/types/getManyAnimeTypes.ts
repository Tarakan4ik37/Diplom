import { Anime, Genres, $Enums } from '@prisma/client';

export enum SortBy {
    releaseDate = 'releaseDate',
    averageRating = 'averageRating',
    name = 'name',
}

export type AnimeGetManyRequest = {
    Querystring: {
        page: number;
        limit: number;
        search?: string;
        startYear?: number;
        endYear?: number;
        genres?: number[];
        includeAllGenres?: boolean;
        type?: $Enums.Type;
        status?: $Enums.AnimeStatus;
        sortBy?: SortBy;
        isDescending?: boolean;
    };
};

export type AnimeGetManyResponse = (Pick<
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
