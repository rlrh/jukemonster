export const refreshToken = async token => {
  const res = await fetch('http://127.0.0.1:8000/authorize/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh: token.refresh }),
  });
  return await res.json();
};
