import { useAuth } from '../state/useAuth';
import axios, { AxiosResponse } from 'axios';

const BACKEND_URL = 'http://127.0.0.1:8000/'; // TODO: shift to env file

interface ApiHook {
  getApi: (path: string) => Promise<AxiosResponse<any>>;
  postApi: (path: string, body: object) => Promise<AxiosResponse<any>>;
  putApi: (path: string, body: object) => Promise<AxiosResponse<any>>;
  patchApi: (path: string, body: object) => Promise<AxiosResponse<any>>;
}

/**
 * A hook that can be used to query our backend's APIs with token refresh methods
 * on failure.
 * Usage: `getApi('rooms/')` and you should expect to get the results.
 */
export const useOurApi: () => ApiHook = () => {
  const { value, ensureTokenValidity } = useAuth();
  const getApi = async (path: string) => {
    if (typeof value === 'string' || value == null) return null;
    const getHeader = () => ({ Authorization: 'Bearer ' + value.access_token });
    let resp = await axios.get(BACKEND_URL + path, { headers: getHeader() });
    if (resp.status >= 400) {
      await ensureTokenValidity();
      resp = await axios.get(BACKEND_URL + path, { headers: getHeader() });
    }
    return resp;
  };

  const postApi = async (path: string, body: object) => {
    if (typeof value === 'string' || value == null) return;
    const getHeader = () => ({ Authorization: 'Bearer ' + value.access_token });
    let resp = await axios.post(BACKEND_URL + path, body, {
      headers: getHeader(),
    });
    if (resp.status >= 400) {
      await ensureTokenValidity();
      resp = await axios.post(BACKEND_URL + path, body, {
        headers: getHeader(),
      });
    }
    return resp;
  };

  const patchApi = async (path: string, body: object) => {
    if (typeof value === 'string' || value == null) return;
    const getHeader = () => ({ Authorization: 'Bearer ' + value.access_token });
    let resp = await axios.patch(BACKEND_URL + path, body, {
      headers: getHeader(),
    });
    if (resp.status >= 400) {
      await ensureTokenValidity();
      resp = await axios.patch(BACKEND_URL + path, body, {
        headers: getHeader(),
      });
    }
    return resp;
  };

  const putApi = async (path: string, body: object) => {
    if (typeof value === 'string' || value == null) return;
    const getHeader = () => ({ Authorization: 'Bearer ' + value.access_token });
    let resp = await axios.put(BACKEND_URL + path, body, {
      headers: getHeader(),
    });
    if (resp.status >= 400) {
      await ensureTokenValidity();
      resp = await axios.patch(BACKEND_URL + path, body, {
        headers: getHeader(),
      });
    }
    return resp;
  };

  return {
    getApi,
    postApi,
    patchApi,
    putApi,
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
  const getApi = async (path: string) => {
    if (typeof value === 'string' || value == null) return;
    const getHeader = () => ({
      Authorization: 'Bearer ' + value.spotify_access_token,
    });
    let resp = await axios.get(path, { headers: getHeader() });
    if (resp.status >= 400) {
      await ensureTokenValidity();
      resp = await axios.get(path, { headers: getHeader() });
    }
    return resp;
  };

  const postApi = async (path: string, body: object) => {
    if (typeof value === 'string' || value == null) return;
    const getHeader = () => ({
      Authorization: 'Bearer ' + value.spotify_access_token,
    });
    let resp = await axios.post(path, body, {
      headers: getHeader(),
    });
    if (resp.status >= 400) {
      await ensureTokenValidity();
      resp = await axios.post(path, body, {
        headers: getHeader(),
      });
    }
    return resp;
  };

  const patchApi = async (path: string, body: object) => {
    if (typeof value === 'string' || value == null) return;
    const getHeader = () => ({
      Authorization: 'Bearer ' + value.spotify_access_token,
    });
    let resp = await axios.patch(path, body, {
      headers: getHeader(),
    });
    if (resp.status >= 400) {
      await ensureTokenValidity();
      resp = await axios.patch(path, body, {
        headers: getHeader(),
      });
    }
    return resp;
  };

  const putApi = async (path: string, body: object) => {
    if (typeof value === 'string' || value == null) return;
    const getHeader = () => ({
      Authorization: 'Bearer ' + value.spotify_access_token,
    });
    let resp = await axios.put(path, body, {
      headers: getHeader(),
    });
    if (resp.status >= 400) {
      await ensureTokenValidity();
      resp = await axios.patch(path, body, {
        headers: getHeader(),
      });
    }
    return resp;
  };

  return {
    getApi,
    postApi,
    patchApi,
    putApi,
  };
};
