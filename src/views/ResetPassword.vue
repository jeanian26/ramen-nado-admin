<template>
  <body>
    <div class="logo-wrapper">
      <img class="logo" alt="Logo" src="../assets/logo.png" />
    </div>

    <div class="content-body">
      <div class="form-wrapper">
        <h1 class="text-title">Ramen nado admin Dashboard</h1>
        <div class="text-register">
          You need to be an admin to login
        </div>

        <div class="field-group">
          <input
            class="input"
            type="text"
            id="txt-email"
            name="email"
            placeholder="E-mail"
            v-model="email"
          />
         

        <div class="field-group-inline">
          <router-link to="/">Remember Password?</router-link>
        </div>
        <div class="field-group">
          <input class="btn-submit" type="submit" value="Reset" @click="resetemail"/>
        </div>
      </div>
    </div>
    </div>
  </body>
</template>

<script>
import { passAuth } from "../firebase.service";
import { sendPasswordResetEmail } from "firebase/auth";
// import Router from "../router";

export default {
  name: "Home",
  data() {
    return {
      email: "",
    };
  },
  methods: {
    resetemail() {
      sendPasswordResetEmail(passAuth(), this.email)
        .then(() => {
          alert("Check Email to reset password");
        })
        .catch((error) => {
          alert("ERROR", error);
        });
    },
  },
};
</script>


<style>
html {
  font-size: 14px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: #fff;
  color: #333;
  font-family: "Open Sans", sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

a {
  color: #c30f42;
  text-decoration: none;
}

a:hover,
a:focus {
  color: #c30f42;
  text-decoration: underline;
}
.content-body {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
}

.form-wrapper {
  width: 400px;
  margin: 0 auto;
}

@media screen and (max-width: 480px) {
  .form-wrapper {
    width: 90%;
  }
}

.text-title {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 3em;
}

.text-register {
  margin-bottom: 1.2em;
}

.input {
  transition: border 0.2s ease-in-out, box-shadow 0.2s ease-in-out,
    -webkit-box-shadow 0.2s ease-in-out;
  border: 1px solid #ddd;
  background-color: #fff;
  width: 100%;
  border-radius: 2px;
  outline: none;
  padding: 0.5em 12px;
  font-size: 16px;
  margin-bottom: 1em;
}

.input:focus {
  border-color: #4e9bf6;
  -webkit-box-shadow: 0 0 4px 0 #4e9bf6;
  box-shadow: 0 0 4px 0 #4e9bf6;
  position: relative;
  z-index: 5;
}

.field-group-inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5em 0 1.5em 0;
}

.btn-submit {
  background-color: #c30f42;
  padding: 0.7em;
  border-radius: 2px;
  outline: 0;
  border: 0;
  width: 100%;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
}

.separator-wrapper {
  position: relative;
  margin: 2em auto;
  width: 100%;
  text-align: center;
}

.separator::before {
  background: #ddd;
  content: "";
  display: block;
  height: 1px;
  position: absolute;
  top: 50%;
  width: 100%;
  z-index: 0;
}

.separator span {
  font-size: 12px;
  line-height: 1.4;
  background: #fff;
  color: #bbb;
  padding: 0 1em;
  position: relative;
  z-index: 1;
}

img.logo {
  max-width: 150px;
  width: 100%;
  margin-bottom: 50px;
}

</style>