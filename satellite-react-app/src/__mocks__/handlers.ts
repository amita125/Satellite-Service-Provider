// src/mocks/handlers.ts

import { rest } from 'msw';

export const handlers = [
  rest.get('/api/company', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Company A' },
        { id: 2, name: 'Company B' },
      ])
    );
  }),
];
