import { useAuth } from '../state/useAuth';
import axios, { AxiosResponse } from 'axios';

const BACKEND_URL = 'http://127.0.0.1:8000/';

interface apiHook {
  getApi: (path: string) => Promise<AxiosResponse<any>>;
  postApi: (path: string, body: object) => Promise<AxiosResponse<any>>;
  patchApi: (path: string, body: object) => Promise<AxiosResponse<any>>;
}

export const useOurApi = (): apiHook => {
  const { value, ensureTokenValidity } = useAuth();
  const getApi = async (path: string) => {
    if (typeof value === 'string' || value == null) return null;
    const getHeader = () => ({ Authorization: 'Bearer ' + value.access_token });
    console.log(BACKEND_URL + path);
    let resp = await axios.get(BACKEND_URL + path, { headers: getHeader() });
    if (resp.status >= 400) {
      await ensureTokenValidity();
      resp = await axios.get(BACKEND_URL + path, { headers: getHeader() });
    }
    console.log(resp);
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

  return {
    getApi,
    postApi,
    patchApi,
  };
};

export const useSpotifyApi = (): apiHook => {
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

  return {
    getApi,
    postApi,
    patchApi,
  };
};
