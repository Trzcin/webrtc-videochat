import { Request, Response, Router } from 'express';
import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();
const roomRouter = Router();

roomRouter.get('/rooms', async (_, res: Response) => {
  const rooms = await prisma.room.findMany({ include: { users: true } });
  return res.json(rooms);
});

roomRouter.post('/newRoom', async (req: Request, res: Response) => {
  if (
    !req.body.name ||
    typeof req.body.name !== 'string' ||
    !req.body.name.trim()
  ) {
    return res.status(422);
  }
  if (
    !req.body.description ||
    typeof req.body.description !== 'string' ||
    !req.body.description.trim()
  ) {
    return res.status(422);
  }

  const name = req.body.name.trim();
  const description = req.body.description.trim();

  const newRoom = await prisma.room.create({
    data: {
      name,
      description,
    },
  });

  return res.json(newRoom);
});

export default roomRouter;
