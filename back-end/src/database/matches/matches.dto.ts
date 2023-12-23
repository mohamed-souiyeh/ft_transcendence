import { IsNotEmpty, IsInt, IsBoolean, IsDate, IsObject } from 'class-validator';

export class MatchDto {

    id: number;

    @IsDate()
    startedAt: Date;

    @IsDate()
    endedAt: Date;

    mode: string;

    @IsNotEmpty()
    @IsObject()
    winnerStats: object;

    @IsNotEmpty()
    @IsObject()
    loserStats: object;


    winnerId : number;
    loserId : number;

    




    constructor(partial: Partial<MatchDto>) {
        Object.assign(this, partial);
    }
}
