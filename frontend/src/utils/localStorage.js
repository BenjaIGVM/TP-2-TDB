import jwtDecode from "jwt-decode";

export function getItem(key) {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
}

export function setItem(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, value);
}


export function getDecodedToken() {
  if(typeof window === "undefined") {
    return null;
  }
  const token = window.localStorage.getItem("token");

  if (token) {
    return jwtDecode(token);
  }

  return null;
}