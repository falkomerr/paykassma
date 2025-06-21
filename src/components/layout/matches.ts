import { appMounted } from '@/models/app-model';
import { trackMediaQuery } from '@withease/web-api';

export const { $matches } = trackMediaQuery('(min-width: 1024px)', {
  setup: appMounted,
});
