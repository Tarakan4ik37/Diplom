import { Anime, Characters } from '@prisma/client';

export type CreateCharacter = Pick<
    Characters,
    'name' | 'photoURL' | 'voiceActor'
>;

export type AnimeUpdateRequest = {
    Params: { id: number };
    Body: Partial<
        Pick<
            Anime,
            | 'name'
            | 'type'
            | 'description'
            | 'releaseDate'
            | 'endDate'
            | 'episodesReleased'
            | 'episodesTotal'
            | 'status'
            | 'season'
            | 'source'
            | 'studio'
            | 'ageRating'
            | 'posterURl'
        >
    > & {
        genres?: number[];
        characters?: (CreateCharacter | number)[];
        related?: number[];
    };
};

export type AnimeUpdateResponse = { success: true };
