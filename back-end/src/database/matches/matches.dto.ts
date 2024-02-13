import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsDate, IsObject } from 'class-validator';

export class MatchDto {

    id: number;

    @IsDate()
    startedAt: Date;

    @IsDate()
    endedAt: Date;

    mode: string;
    
    @IsNotEmpty()
    @IsObject()
    winnerStats: Prisma.JsonObject;

    @IsNotEmpty()
    @IsObject()
    loserStats: Prisma.JsonObject;


    winnerId : number;
    loserId : number;

    




    // constructor(partial: Partial<MatchDto>) {
    //     Object.assign(this, partial);
    // }
}
