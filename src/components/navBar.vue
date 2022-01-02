<template>
  <div class="navbar">
    <div class="logo-container">
      <router-link class="router" to="/Dashboard">
        <img alt="Vue logo" src="../assets/logo.png" />
      </router-link>
    </div>
    <div class="navigation">
      <router-link class="router" to="/Dashboard">Dashboard</router-link>
      <router-link class="router" to="/Orders">Orders</router-link>
      <!-- <router-link class="router" to="/Cart">Cart</router-link> -->
      <router-link class="router" to="/Menu">Menu</router-link>
      <router-link class="router" to="/Users">Users</router-link>
      <router-link class="router" to="/Report">Report</router-link>
      <router-link class="router" to="/Logout" @click="logout()">Log Out</router-link>
    </div>
  </div>
</template>

<script>
import { passAuth } from "../firebase.service";
import { signOut } from "firebase/auth";
export default {
  name: "navBar",
  props: {
    msg: String,
  },
  methods: {
    logout() {
      signOut(passAuth())
        .then(() => {
          alert("Succesfully Logout");
        })
        .catch((error) => alert(error));
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
}

.navbar .logo-container img {
  max-width: 50px;
}

.navbar .logo-container span {
  margin-left: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #c30f42;
}

.navigation a.router {
  font-size: 18px;
  font-weight: 600;
  color: #c30f42;
  padding-left: 20px;
}
html {
  background-color: rgb(245, 243, 243);
}
</style>