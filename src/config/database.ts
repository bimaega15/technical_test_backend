import { config as dotenv } from "dotenv";
dotenv();

export const development = (): any => {
  return process.env.mongo_development;
};

export const production = (): any => {
  return process.env.mongo_production;
};

export const test = (): any => {
  return process.env.mongo_test;
};
