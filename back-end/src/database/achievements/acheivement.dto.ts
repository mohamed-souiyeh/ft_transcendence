import { IsNotEmpty, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class AchievementDto {

    id: number;
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    image: string;

    constructor(partial: Partial<AchievementDto>) {
        Object.assign(this, partial);
  }
}

// sooo whar the functions u need and what services u want