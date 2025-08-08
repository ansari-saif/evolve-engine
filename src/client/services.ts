import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';



export type DefaultData = {
        Post151586B8443E48EaBe1eC664Fdb2E9A0: {
                    accept: string
acceptEncoding: string
cacheControl: string
contentLength: string
contentType: string
host: string
postmanToken: string
requestBody: {
prompt: string;
}
userAgent: string
                    
                };
    }

export class DefaultService {

	/**
	 * Send data to Webhook
	 * @returns any Request successful
	 * @throws ApiError
	 */
	public static post151586B8443e48EaBe1eC664Fdb2E9A0(data: DefaultData['Post151586B8443E48EaBe1eC664Fdb2E9A0']): CancelablePromise<{
answer?: string;
}> {
		const {
contentLength,
acceptEncoding,
host,
postmanToken,
cacheControl,
accept,
userAgent,
contentType,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/151586b8-443e-48ea-be1e-c664fdb2e9a0',
			headers: {
				'content-length': contentLength, 'accept-encoding': acceptEncoding, host, 'postman-token': postmanToken, 'cache-control': cacheControl, accept, 'user-agent': userAgent, 'content-type': contentType
			},
			body: requestBody,
			mediaType: 'application/json',
		});
	}

}