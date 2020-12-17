import { login } from '@/api/user'
import { getToken, removeToken,setToken,getBaseUrl,setBaseUrl,getItem,setItem } from '@/utils/auth'

const state = {
  token: getToken(),
  baseURL:getBaseUrl(),
  PATH_API:getItem('PATH_API') ||'/api/',
  PATH_ADMIN:getItem('PATH_ADMIN') || '/admin/',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    if(token)setToken(token)
    else removeToken();
  },
  SET_BASE: (state, {baseURL,PATH_API,PATH_ADMIN}) => {
    state.baseURL = baseURL
    state.PATH_API=PATH_API
    state.PATH_ADMIN=PATH_ADMIN
    setBaseUrl(baseURL)
    setItem('PATH_API',PATH_API)
    setItem('PATH_ADMIN',PATH_ADMIN)
  },
}

const actions = {
  // user login
    login({ commit }, { username, password ,baseURL,PATH_API,PATH_ADMIN }) {
      commit('SET_BASE', {baseURL,PATH_API,PATH_ADMIN})
      return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password.trim() }).then(res => {
        const {token}=res;
        commit('SET_TOKEN', token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    commit('SET_TOKEN', '')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
