import { hc } from 'hono/client';

import type { AppType } from '../../../backend/src/app.js';

export const api = hc<AppType>(window.location.origin);
