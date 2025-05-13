import { Anime } from '@prisma/client';

export type AnimeGetOneRequest = { Params: { id: number } };

export type AnimeGetOneResponse = Omit<Anime, 'Review' | 'StatusViewing'>;
