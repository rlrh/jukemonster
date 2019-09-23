import { useAuth } from '../state/useAuth';
import axios, { AxiosResponse } from 'axios';

const BACKEND_URL = 'http://127.0.0.1:8000/';

interface apiHook {
  getApi: (path: string) => Promise<AxiosResponse<any>>;
  postApi: (path: string, body: object) => Promise<AxiosResponse<any>>;
  patchApi: (path: string, body: object) => Promise<AxiosResponse<any>>;
}

export const useOurApi = (): apiHook => {
  const { user, ensureTokenValidity } = useAuth();
  const getApi = async (path: string) => {
    const getHeader = () => ({ Authorization: 'Bearer ' + user.access_token });
    let resp = await axios.get(BACKEND_URL + path, { headers: getHeader() });
    if (resp.status >= 400) {
      await ensureTokenValidity();
      resp = await axios.get(BACKEND_URL + path, { headers: getHeader() });
    }
    return resp;
  };

  const postApi = async (path: string, body: object) => {
    const getHeader = () => ({ Authorization: 'Bearer ' + user.access_token });
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
    const getHeader = () => ({ Authorization: 'Bearer ' + user.access_token });
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
  const { user, ensureTokenValidity } = useAuth();
  const getApi = async (path: string) => {
    const getHeader = () => ({
      Authorization: 'Bearer ' + user.spotify_access_token,
    });
    let resp = await axios.get(BACKEND_URL + path, { headers: getHeader() });
    if (resp.status >= 400) {
      await ensureTokenValidity();
      resp = await axios.get(BACKEND_URL + path, { headers: getHeader() });
    }
    return resp;
  };

  const postApi = async (path: string, body: object) => {
    const getHeader = () => ({
      Authorization: 'Bearer ' + user.spotify_access_token,
    });
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
    const getHeader = () => ({
      Authorization: 'Bearer ' + user.spotify_access_token,
    });
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
