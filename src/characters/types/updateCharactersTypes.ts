import { Characters } from '@prisma/client';

export type CharactersUpdateRequest = {
    Params: {
        id: number;
    };
    Body: Partial<Pick<Characters, 'name' | 'photoURL' | 'voiceActor'>>;
};

export type CharactersUpdateResponse = { success: true };
