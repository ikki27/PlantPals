import { isAxiosError } from 'axios';

/**
 * Iz napake API-ja izlušči berljivo sporočilo.
 * NestJS vrača { message: string | string[] }; pri validaciji je to seznam.
 */
export function getErrorMessages(error: unknown): string[] {
  if (isAxiosError(error)) {
    if (!error.response) {
      return ['Strežnik ni dosegljiv. Poskusite znova kasneje.'];
    }
    const message = (error.response.data as { message?: string | string[] })
      ?.message;
    if (Array.isArray(message)) return message;
    if (message) return [message];
  }
  return ['Prišlo je do nepričakovane napake.'];
}
