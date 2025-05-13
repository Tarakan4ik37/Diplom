import { FastifyInstance } from 'fastify';
import {
    GenresGetManyRequest,
    GenresGetManyResponse,
} from './types/getManyGenresTypes.ts';
import { GenresUpdateRequest } from './types/updateGenresTypes.ts';
import {
    GenresCreateRequest,
    GenresCreateResponse,
} from './types/createGenresTypes.ts';

export class GenresService {
    constructor(private readonly fastify: FastifyInstance) {}

    public async getMany({
        page,
        limit,
        search,
        isDescending,
    }: GenresGetManyRequest['Querystring']): Promise<GenresGetManyResponse> {
        return this.fastify.prisma.genres.findMany({
            select: {
                id: true,
                name: true,
            },
            where: {
                name: search
                    ? {
                          contains: search,
                          mode: 'insensitive',
                      }
                    : undefined,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { name: isDescending ? 'desc' : 'asc' },
        });
    }

    public async update(
        data: GenresUpdateRequest['Body'] & { id: number },
    ): Promise<void> {
        const scalarFields = ['name'] as const;

        const updates: Record<string, any> = Object.fromEntries(
            scalarFields
                .map((key) => [key, data[key]])
                .filter(([_, value]) => value !== undefined),
        );

        await this.fastify.prisma.genres.update({
            where: { id: data.id },
            data: updates,
        });
    }

    public async delete(id: number): Promise<void> {
        await this.fastify.prisma.genres.delete({ where: { id } });
    }

    public async create(
        data: GenresCreateRequest['Body'],
    ): Promise<GenresCreateResponse> {
        return this.fastify.prisma.genres.create({
            select: { id: true },
            data: {
                name: data.name,
            },
        });
    }
}
