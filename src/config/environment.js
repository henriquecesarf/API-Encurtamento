const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  DB_HOST: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1h'),
  LOG_LEVEL: Joi.string().valid('info', 'debug', 'error').default('info'),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Erro na configuração do ambiente: ${error.message}`);
}

module.exports = {
  NODE_ENV: envVars.NODE_ENV,
  DB_HOST: envVars.DB_HOST,
  DB_NAME: envVars.DB_NAME,
  DB_USER: envVars.DB_USER,
  DB_PASSWORD: envVars.DB_PASSWORD,
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_EXPIRATION: envVars.JWT_EXPIRATION,
  LOG_LEVEL: envVars.LOG_LEVEL,
};
