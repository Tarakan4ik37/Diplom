import { FastifyInstance } from 'fastify';
import {
    CharactersGetManyRequest,
    CharactersGetManyResponse,
} from './types/getManyCharactersTypes.ts';
import { CharactersUpdateRequest } from './types/updateCharactersTypes.ts';

export class CharactersService {
    constructor(private readonly fastify: FastifyInstance) {}

    public async getMany({
        page,
        limit,
        search,
        sortBy,
        isDescending,
        nameAnime,
    }: CharactersGetManyRequest['Querystring']): Promise<CharactersGetManyResponse> {
        return this.fastify.prisma.characters.findMany({
            select: {
                id: true,
                name: true,
                photoURL: true,
                voiceActor: true,
                anime: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            where: {
                name: search
                    ? {
                          contains: search,
                          mode: 'insensitive',
                      }
                    : undefined,
                anime: nameAnime
                    ? {
                          some: {
                              name: {
                                  contains: nameAnime,
                                  mode: 'insensitive',
                              },
                          },
                      }
                    : undefined,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: sortBy
                ? {
                      [sortBy]: isDescending ? 'desc' : 'asc',
                  }
                : undefined,
        });
    }

    public async update(
        data: CharactersUpdateRequest['Body'] & { id: number },
    ): Promise<void> {
        const scalarFields = ['name', 'photoURL', 'voiceActor'] as const;

        const updates: Record<string, any> = Object.fromEntries(
            scalarFields
                .map((key) => [key, data[key]])
                .filter(([_, value]) => value !== undefined),
        );

        await this.fastify.prisma.characters.update({
            where: { id: data.id },
            data: updates,
        });
    }

    public async delete(id: number): Promise<void> {
        await this.fastify.prisma.characters.delete({
            where: { id },
        });
    }
}
