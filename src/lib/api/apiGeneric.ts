import { PUBLIC_API_URL } from '$env/static/public';
import { getToken } from './authApi';
import { CustomError, HttpError, UnauthorizedError } from './error';

const checkIfResposeIsUnauthorized = (res: Response) => {
	if (res.status === 403) {
		throw new UnauthorizedError();
	}
};

export type ResponeData<T> = {
	data: T;
	fromCache: boolean;
};

function responseToData<T>(response: Response, data: T): ResponeData<T> {
	return {
		data,
		fromCache: response.headers.get('x-served-from') === 'cache'
	};
}

export async function apiGet<T>(
	path: string,
	verifyData?: (data: T) => boolean
): Promise<ResponeData<T>> {
	const url = new URL(path, PUBLIC_API_URL);

	try {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${await getToken()}`
			}
		});

		if (!response.ok) {
			checkIfResposeIsUnauthorized(response);

			const errorData = await response.json();

			throw new HttpError(
				response.status,
				`Failed to fetch data from ${url}: ${errorData.message}`,
				errorData.message ?? response.statusText
			);
		}

		const data: T = await response.json();
		if (verifyData && !verifyData(data)) {
			throw new CustomError(`Failed to verify data.`);
		}

		return responseToData(response, data);
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
}

export async function apiPost<T>(
	path: string,
	body?: any,
	verifyData?: (data: T) => boolean
): Promise<ResponeData<T>> {
	const url = new URL(path, PUBLIC_API_URL);
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${await getToken()}`
			},
			body: body ? JSON.stringify(body) : undefined
		});

		if (!response.ok) {
			checkIfResposeIsUnauthorized(response);

			const errorData = await response.json();

			throw new HttpError(
				response.status,
				`Failed to post data from ${url}: ${errorData.message}`,
				errorData.message ?? response.statusText
			);
		}

		const data: T = await response.json();
		if (verifyData && !verifyData(data)) {
			throw new CustomError(`Failed to verify data.`);
		}

		return responseToData(response, data);
	} catch (error) {
		console.error('Error posting data:', error);
		throw error;
	}
}

export async function apiPostFile<T>(
	path: string,
	file: File,
	verifyData?: (data: T) => boolean
): Promise<ResponeData<T>> {
	const url = new URL(path, PUBLIC_API_URL);
	try {
		const formData = new FormData();
		formData.append('file', file, file.name);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${await getToken()}`
			},
			body: formData
		});

		if (!response.ok) {
			checkIfResposeIsUnauthorized(response);

			const errorData = await response.json();

			throw new HttpError(
				response.status,
				`Failed to post file to ${url}: ${errorData.message}`,
				errorData.message ?? response.statusText
			);
		}

		const data: T = await response.json();
		if (verifyData && !verifyData(data)) {
			throw new CustomError(`Failed to verify data.`);
		}
		return responseToData(response, data);
	} catch (error) {
		console.error('Error posting file:', error);
		throw error;
	}
}

export async function apiGetFile(path: string) {
	const url = new URL(path, PUBLIC_API_URL);
	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${await getToken()}`
			}
		});

		if (!response.ok) {
			checkIfResposeIsUnauthorized(response);

			const errorData = await response.json();

			throw new HttpError(
				response.status,
				`Failed to get file from ${url}: ${errorData.message}`,
				errorData.message ?? response.statusText
			);
		}

		return response.blob();
	} catch (error) {
		console.error('Error fetching file:', error);
		throw error;
	}
}
