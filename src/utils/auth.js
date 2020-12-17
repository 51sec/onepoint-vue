const TokenKey = 'Admin-Token'
const BaseUrlKey = 'Base-URL'


export function getToken() {
  return localStorage.getItem(TokenKey+":"+getBaseUrl());
}

export function setToken(token) {
  return localStorage.setItem(TokenKey+":"+getBaseUrl(),token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey+":"+getBaseUrl())
}

export function getBaseUrl() {
  return localStorage.getItem(BaseUrlKey) || "";
}

export function setBaseUrl(baseUrl) {
  return localStorage.setItem(BaseUrlKey,baseUrl)
}

export function getItem(k) {
  return localStorage.getItem(k) || "";
}

export function setItem(k,v) {
  return localStorage.setItem(k,v)
}