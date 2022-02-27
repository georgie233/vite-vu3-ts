<script setup lang="ts">
  import HelloWorld from './components/HelloWorld.vue'
  import {request, setAuthorization} from "./utils/request";
  import Cookie from "js-cookie";

  setAuthorization({'token':123456})
  console.log(Cookie.get('Authorization'))
  request('http://www.baidu.com').then(res=>{
    console.log(res);
  })
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <router-view />
</template>

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
