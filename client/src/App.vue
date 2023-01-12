<template>
  <div id="app">
    <br/>
    <br/>
    <label for="name">Name:</label>
    <input type="text" id="name" v-model="user.name">
    <br/>
    <br/>
    <label for="email">Email:</label>
    <input type="text" id="email" v-model="user.email">
    <br/>
    <br/>
    <label for="password">Password:</label>
    <input type="text" id="password" v-model="user.password">
    <br/>
    <br/>
    <button @click="createUser">Criar Usuário</button>
    <br/>
    <br/>
    {{ resultUser }}
    <br/>
    <br/>
    <br/>
    <br/>
    <label for="emailLogin">Email:</label>
    <input type="text" id="emailLogin" v-model="login.email">
    <br/>
    <br/>
    <label for="passwordLogin">Password:</label>
    <input type="text" id="passwordLogin" v-model="login.password">
    <br/>
    <br/>
    <button @click="authenticate">Login</button>
    <br/>
    <br/>
    {{ resultLogin }}
  </div>
</template>

<script lang="ts">
import axios from "axios";

export default {
  name: 'App',
  data() {
    return {
      userAPI: {},
      user: {
        name: '',
        email: '',
        password: ''
      },
      login: {
        email: '',
        password: ''
      },
      resultUser: {},
      resultLogin: {}
    }
  },
  async created() {
    this.userAPI = axios.create({
      baseURL: `${process.env.VUE_APP_API_URL}` + '/api',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'access-control-allow-headers': '*',
        'access-control-allow-Methods': '*',
      },
    })
  },
  methods: {
    async createUser() {
      const { data, status } = await this.userAPI.request({
        method: 'POST',
        url: '/register',
        data: this.user
      }).catch(function (error) {
        if (error.response) {
          return {
            data: error.response.data,
            status: error.response.status
          }
        } else if (error.request) {
          return error.request
        } else {
          return error.message
        }
      });

      this.resultUser = {
        data,
        status
      }
    },
    async authenticate() {
      const { data, status } = await this.userAPI.request({
        method: 'POST',
        url: '/login',
        data: this.login
      }).catch(function (error) {
        if (error.response) {
          return {
            data: error.response.data,
            status: error.response.status
          }
        } else if (error.request) {
          return error.request
        } else {
          return error.message
        }
      });

      this.resultLogin = {
        data,
        status
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
