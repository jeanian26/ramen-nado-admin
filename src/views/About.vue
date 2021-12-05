<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
// import { passAuth } from "../firebase.service";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import Router from "../router";

export default {
  name: "About",
  data() {
    return {
      email: "",
      password: "",
    };

    
  },
   mounted() {
    this.getUser();
  },
    methods: {
    getUser(){
      console.log(this.$storage.key("test-key"))
    }
  },
};
</script>