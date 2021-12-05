<template>
  <div class="container">
    <div class="navbar-container">
      <navBar></navBar>
      <pageHeader page="Menu" :user="user"></pageHeader>
    </div>
    <div class="page-container" id="menu">
      <h2>Select Menu Category</h2>
      <div class="main-overview">
          <OverviewCard
            v-for="(value, key) in categoryList" :key="key"
            :cardTitle="categoryList[key].name"
            icon="box"
            @click="goToLink('/Menu/' + key)"
          />
       
      </div>
      <button @click="goToLink('/newcategory')">Add New Category</button>
      
    </div>
  </div>
</template>


<script>
import navBar from "@/components/navBar.vue";
import pageHeader from "@/components/pageHeader.vue";
import { getDatabase, ref, child, get } from "firebase/database";
import OverviewCard from "@/components/OverviewCard.vue";
import Router from "../router";

export default {
  name: "Dash-board",
  components: {
    navBar,
    pageHeader,
    OverviewCard,
  },
  data() {
    return {
      categoryList: {},
      count: 0,
    };
  },
  mounted() {
    this.getEvents();
  },
  methods: {
    getEvents() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, "category/"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            console.log(result);
            this.categoryList = result;
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    goToLink(key){
        key = key.trim()
        console.log(key)
        Router.push(key)
    }
    

  },
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

.page-container h2 {
  text-align: center;
}

#menu button {
  margin: 20px auto 0;
  padding: 10px 20px;
  border: none;
  background-color: #e62222;
  color: white;
  cursor: pointer;
  box-shadow: 5px 5px 10px #ddd3d3;
}
#menu button:hover {
  background-color: #ee6d6d;
}

#menu {
  display: flex;
  flex-direction: column;
}
</style>