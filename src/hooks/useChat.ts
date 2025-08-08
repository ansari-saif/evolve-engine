import { useMutation } from '@tanstack/react-query';
import { OpenAPI, DefaultService } from '../client';

export type AskArgs = { prompt: string };
export type AskResult = { answer?: string };

/**
 * useChatCompletion
 * - Encapsulates the chat webhook call using the generated API client.
 * - Sets the OpenAPI base URL on mount (customizable via argument).
 */
export function useChatCompletion() {
  const mutation = useMutation<AskResult, Error, AskArgs>({
    mutationFn: async ({ prompt }) => {
      const body = { prompt };
      const payload = {
        contentLength: String(JSON.stringify(body).length),
        acceptEncoding: 'gzip, deflate, br',
        host: new URL(OpenAPI.BASE).host,
        postmanToken: '',
        cacheControl: 'no-cache',
        accept: 'application/json',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        contentType: 'application/json',
        requestBody: body,
      } as const;

      const res = await DefaultService.post151586B8443e48EaBe1eC664Fdb2E9A0(payload);
      return res as AskResult;
    },
  });

  return {
    ask: mutation.mutateAsync,
    isPending: mutation.isPending,
    ...mutation,
  };
}
