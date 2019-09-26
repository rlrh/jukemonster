import { useAuth } from '../state/useAuth';
import axios, { AxiosResponse } from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + '/'; // TODO: shift to env file

interface ApiHook {
  getApi: (path: string) => Promise<AxiosResponse<any>>;
  postApi: (path: string, body: object) => Promise<AxiosResponse<any>>;
  putApi: (path: string, body: object) => Promise<AxiosResponse<any>>;
  patchApi: (path: string, body: object) => Promise<AxiosResponse<any>>;
  deleteApi?: (path: string) => Promise<AxiosResponse<any>>;
}

/**
 * A hook that can be used to query our backend's APIs with token refresh methods
 * on failure.
 * Usage: `getApi('rooms/')` and you should expect to get the results.
 */
export const useOurApi: () => ApiHook = () => {
  const { value, ensureTokenValidity } = useAuth();

  async function withRetry(
    toCall: () => Promise<AxiosResponse<any>>,
  ): Promise<AxiosResponse<any>> {
    try {
      const resp = await toCall();
      return resp;
    } catch (error) {
      try {
        await ensureTokenValidity();
        const secondAttempt = await toCall();
        return secondAttempt;
      } catch (otherError) {
        console.log(otherError);
        throw otherError;
      }
    }
  }

  const getHeader = () => {
    if (typeof value === 'string' || value == null) return null;
    return { Authorization: 'Bearer ' + value.access_token };
  };

  const getApi = async (path: string) => {
    const headers = getHeader();
    if (!headers) return null;
    return withRetry(() =>
      axios.get(BACKEND_URL + path, { headers: getHeader() }),
    );
  };

  const postApi = async (path: string, body: object) => {
    const headers = getHeader();
    if (!headers) return null;
    return withRetry(() =>
      axios.post(BACKEND_URL + path, body, {
        headers: getHeader(),
      }),
    );
  };

  const patchApi = async (path: string, body: object) => {
    const headers = getHeader();
    if (!headers) return null;
    return withRetry(() =>
      axios.patch(BACKEND_URL + path, body, {
        headers: getHeader(),
      }),
    );
  };

  const putApi = async (path: string, body: object) => {
    const headers = getHeader();
    if (!headers) return null;
    return withRetry(() =>
      axios.put(BACKEND_URL + path, body, {
        headers: getHeader(),
      }),
    );
  };

  const deleteApi = async (path: string) => {
    const headers = getHeader();
    if (!headers) return null;
    return withRetry(() =>
      axios.delete(BACKEND_URL + path, { headers: getHeader() }),
    );
  };

  return {
    getApi,
    postApi,
    patchApi,
    putApi,
    deleteApi,
  };
};

/**
 * A hook that can be used to query Spotify's APIs with token refresh methods
 * on failure.
 * Usage: `getApi({spotify path with params})` and you should get a response
 * with the requested data.
 */
export const useSpotifyApi: () => ApiHook = () => {
  const { value, ensureTokenValidity } = useAuth();

  async function withRetry(
    toCall: () => Promise<AxiosResponse<any>>,
  ): Promise<AxiosResponse<any>> {
    try {
      const resp = await toCall();
      return resp;
    } catch (error) {
      try {
        await ensureTokenValidity();
        const secondAttempt = await toCall();
        return secondAttempt;
      } catch (otherError) {
        console.log(otherError);
        throw otherError;
      }
    }
  }

  const getHeader = () => {
    if (typeof value === 'string' || value == null) return null;
    return { Authorization: 'Bearer ' + value.access_token };
  };

  const getApi = async (path: string) => {
    const headers = getHeader();
    if (!headers) return null;
    return withRetry(() => axios.get(path, { headers: getHeader() }));
  };

  const postApi = async (path: string, body: object) => {
    const headers = getHeader();
    if (!headers) return null;
    return withRetry(() =>
      axios.post(path, body, {
        headers: getHeader(),
      }),
    );
  };

  const patchApi = async (path: string, body: object) => {
    const headers = getHeader();
    if (!headers) return null;
    return withRetry(() =>
      axios.patch(path, body, {
        headers: getHeader(),
      }),
    );
  };

  const putApi = async (path: string, body: object) => {
    const headers = getHeader();
    if (!headers) return null;
    return withRetry(() =>
      axios.put(path, body, {
        headers: getHeader(),
      }),
    );
  };

  return {
    getApi,
    postApi,
    patchApi,
    putApi,
  };
};
