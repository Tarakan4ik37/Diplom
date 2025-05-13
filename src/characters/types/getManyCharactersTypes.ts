import { Characters } from '@prisma/client';

export enum SortBy {
    name = 'name',
}

export type CharactersGetManyRequest = {
    Querystring: {
        page: number;
        limit: number;
        search?: string;
        sortBy?: SortBy;
        isDescending?: boolean;
        nameAnime?: string;
    };
};

export type CharactersGetManyResponse = (Pick<
    Characters,
    'id' | 'name' | 'photoURL' | 'voiceActor'
> & {
    anime: {
        id: number;
        name: string;
    }[];
})[];
