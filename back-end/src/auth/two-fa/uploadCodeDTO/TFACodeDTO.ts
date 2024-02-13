import { IsNumberString } from "class-validator";

export class TFACodeDTO {

    @IsNumberString()
    code: string;
}