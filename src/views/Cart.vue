<template>
  <div class="container">
    <div class="navbar-container">
      <navBar></navBar>
      <pageHeader page="Cart" :user="user"></pageHeader>
    </div>
    <div class="page-container"></div>
  </div>
</template>


<script>
import navBar from "@/components/navBar.vue";
import pageHeader from "@/components/pageHeader.vue";
// import { getDatabase, ref, child, get } from "firebase/database";
// import Router from "../router";

export default {
  name: "Dash-board",
  components: {
    navBar,
    pageHeader,
  },
  data() {
    return {
      
    };
  },
  mounted() {},
  methods: {},
};
</script>


<style>
.container {
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
  padding: 0 50px;
}
.page-container {
  padding: 30px 0;
}

.welcome-container {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  align-items: center;
}
.welcome-container img {
  max-width: 300px;
}

/* cards */
.main-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(265px, 1fr));
  grid-auto-rows: 94px;
  grid-gap: 30px;
  margin: 20px;
}

/* grid */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
  margin-top: 50px;
}

table {
  margin-top: 15px;
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

article {
  display: flex;
  width: 100%;
  flex-direction: column;
  background-color: white;
  box-shadow: 5px 5px 10px #ddd3d3;
  padding: 15px;
}

article button {
  margin: 20px auto 0;
  padding: 10px 20px;
  border: none;
  background-color: #e62222;
  color: white;
  cursor: pointer;
  box-shadow: 5px 5px 10px #ddd3d3;
}
article button:hover {
  background-color: #ee6d6d;
}
</style>