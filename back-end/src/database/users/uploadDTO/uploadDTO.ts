import { IsOptional, IsString } from "class-validator";
import { HasMimeType, IsFile, MemoryStoredFile } from "nestjs-form-data";

export class UploadDTO {

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  avatar: MemoryStoredFile;
}


export class UpdateUsernameDTO {
  
  @IsString()
  username: string;
}

export class UpdateAvatarDTO {
  
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  avatar: MemoryStoredFile;
}