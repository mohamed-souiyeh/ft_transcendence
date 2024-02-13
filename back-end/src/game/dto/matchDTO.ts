import { IsJSON, IsNumber, IsSemVer, IsString } from "class-validator";


export class MatchDTO
{
    @IsNumber()
    id;

    @IsString()
    mode;

    @IsJSON()
    winnerStats;
    @IsJSON()
    loserStats;

    @IsNumber()
    winnerID;

    @IsNumber()
    loserID;

    @IsNumber()
    score1;
    @IsNumber()
    score2;

    @IsNumber()
    startTime;
    @IsNumber()
    endTime;
};

