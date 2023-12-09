import { FileSystemStoredFile } from "nestjs-form-data";

export const uploadConfig = {
  storage: FileSystemStoredFile,
  fileSystemStoragePath: 'avatars',
  limits: {
    fields: 1,
    fileSize: 1024 * 1024 * 5, // this is 1MB
    files: 1,
  },
};

export const usernameUpdateConfig = {
  limits: {
    fields: 1,
    fileSize: 1024 * 1024 * 5, // this is 1MB
    files: 0,
  },
};

export const avatarUpdateConfig = {
  storage: FileSystemStoredFile,
  fileSystemStoragePath: 'avatars',
  limits: {
    fields: 0,
    fileSize: 1024 * 1024 * 5, // this is 1MB
    files: 1,
  },
};