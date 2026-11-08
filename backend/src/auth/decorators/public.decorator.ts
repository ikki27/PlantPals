import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Označi končno točko kot javno (brez JWT).
 * Vse ostale končne točke so privzeto zaščitene z globalnim JwtAuthGuard.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
