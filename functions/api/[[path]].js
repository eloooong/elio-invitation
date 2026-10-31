import { neon } from '@neondatabase/serverless';
import { handleRequest } from '../../server/api.js';

export async function onRequest({ request, env }) {
  return handleRequest(request, env, env.DATABASE_URL ? neon(env.DATABASE_URL) : null);
}
