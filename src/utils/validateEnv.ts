import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    NATS_CLIENT_ID: str(),
    NATS_URL: str(),
    NATS_CLUSTER_ID: str(),
  });
};

export default validateEnv;
