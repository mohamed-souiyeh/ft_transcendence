import * as joi from 'joi';


export const ConfigModuleOptions = {
    cache: true,
    isGlobal: true,
    ignoreEnvFile: true,
    validationSchema: joi.object({
      POSTGRES_HOST: joi.string().required(),
      POSTGRES_NAME: joi.string().required(),
      POSTGRES_PASSWORD: joi.string().required(),
      POSTGRES_PORT: joi.number().required(),
      POSTGRES_USER: joi.string().required(),
      DATABASE_URL: joi.string().required(),
      FT_APP_ID: joi.string().required(),
      FT_APP_SECRET: joi.string().required(),
      FT_REDIRECT_URI: joi.string().required(),
      GOOGLE_CLIENT_ID: joi.string().required(),
      GOOGLE_REDIRECT_URI: joi.string().required(),
      GOOGLE_SECRET: joi.string().required(),
      JWT_REFRESH_SECRET: joi.string().required(),
      REFRESH_TOKEN_KEY: joi.string().required(),
      JWT_SECRET: joi.string().required(),
      ACCESS_TOKEN_KEY: joi.string().required(),
      TWO_FACTOR_AUTHENTICATION_APP_NAME: joi.string().required(),
      HOME_URL: joi.string().required(),
      LOGIN_URL: joi.string().required(),
      PRIVATE_KEY_PATH: joi.string().required(),
      PUBLIC_CERT_PATH: joi.string().required(),
    }),
}