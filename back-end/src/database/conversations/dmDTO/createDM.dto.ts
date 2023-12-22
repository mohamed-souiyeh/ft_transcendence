import { IsNotEmpty } from "class-validator";


export class createDMdto {

  @IsNotEmpty()
  username: string;

  constructor(partial: Partial<createDMdto>) {
    Object.assign(this, partial);
  }
}