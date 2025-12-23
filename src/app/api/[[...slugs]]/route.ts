import { redis } from '@/lib/redis';
import { Elysia } from 'elysia';
import { nanoid } from 'nanoid';

const ROOM_TTL_SECONDS = 60 * 10 // 10 mins for auto exipre the room

const room = new Elysia({ prefix: '/room' })
  .post("/create", async () => {
    const roomId = nanoid();

    await redis.hset(`meta:${roomId}`, {
      connected: [],
      createdAt: Date.now() 
    })

    console.log("New room created..!");

    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS);

    return { roomId };
  })

const app = new Elysia({ prefix: '/api' })
  .use(room)
  .get('/user', { name: "Dev" })

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
