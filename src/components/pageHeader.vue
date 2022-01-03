<template>
  <div class="page-header">
    <h2>{{ page }}</h2>
    <h2>
      Welcome,
      {{ user }}
    </h2>
  </div>
</template>
<script>
import { passAuth } from "../firebase.service";
import { onAuthStateChanged } from "firebase/auth";
// import { getDatabase, ref as refData, child, get } from "firebase/database";
import Router from "../router";
export default {
  name: "pageHeader",
  props: {
    page: String,
  },
  data() {
    return {
      user: "",
    };
  },
  mounted() {
    this.checkLoggedIn();
  },
  methods: {
    checkLoggedIn() {
      onAuthStateChanged(passAuth(), (user) => {
        if (user) {
          // const uid = user.uid;
            this.user = user.displayName
        } else {
          console.log("no user logged in");
          Router.push("/");
        }
      });
    },
  },
};
</script>

<style scoped>
.page-header h2 {
  display: inline-block;
}

.page-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #d9d9d9;
}
</style>