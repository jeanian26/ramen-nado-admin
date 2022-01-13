<template>
  <div class="container">
    <div class="navbar-container">
      <navBar></navBar>
      <pageHeader :page="'Category ' + this.name" :user="user"></pageHeader>
    </div>
    <div class="page-container" id="menuList">
      <div class="button-container">
        <button @click="gotoLink('editcategory/' + this.$route.params.key)">
          Edit Category
        </button>
        <button style="margin-left: 20px" @click="gotoLink('newitem')">
          Add New Item
        </button>
        <!-- <button style="margin-left: 20px" @click="gotoLink('newcategory')">Add New Category</button> -->
      </div>
      <div class="flex-container-center">
        <div class="product-cards-container">
          <div
            class="card"
            v-for="item in productList"
            :key="item.title"
            @click="goToItem(item.key)"
          >
            <div class="card-image-container">
              <img :src="item.imageUri" alt="" />
            </div>
            <div class="card-title-container">
              <h3>{{ item.name }}</h3>
              <p>PHP {{ item.price }}</p>
              <p v-if="item.stock <= 10" class="low-indicator">LOW STOCKS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import navBar from "@/components/navBar.vue";
import pageHeader from "@/components/pageHeader.vue";
import { getDatabase, ref, child, get } from "firebase/database";
import Router from "../router";

export default {
  name: "Dash-board",
  components: {
    navBar,
    pageHeader,
  },
  data() {
    return {
      count: 0,
      page: "Category " + this.$route.params.key,
      productList: [],
      name:''
    };
  },
  mounted() {
    this.getEvents();
    this.getData();
  },
  methods: {
    getEvents() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, "products/"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            for (var key of Object.keys(result)) {
              if (result[key].Category === this.$route.params.key) {
                console.log("true");
                this.productList.push(result[key]);
              }
            }
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getData() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, "category/" + this.$route.params.key))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            console.log(result);
            this.name = result.name;
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    goToCategory(key) {
      key = key.trim();
      console.log(key);
      Router.push("/Menu/" + key);
    },
    gotoLink(link) {
      Router.push("/" + link);
    },
    goToItem(item) {
      Router.push(`${this.$route.params.key}/${item}`);
    },
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

#menuList button {
  margin: 20px auto 0;
  padding: 10px 20px;
  border: none;
  background-color: #e62222;
  color: white;
  cursor: pointer;
  box-shadow: 5px 5px 10px #ddd3d3;
}
#menuList button:hover {
  background-color: #ee6d6d;
}

#menuList {
  display: flex;
  flex-direction: column;
}

/* card */
.product-cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.card {
  max-width: 200px;
  width: 100%;
  border: 1px solid #d9d9d9;
  margin: 15px;
}
.card:hover {
  cursor: pointer;
  box-shadow: 5px 5px 10px #cbcbcb;
}
.card-image-container {
  height: 200px;
}
.card-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-title-container {
  text-align: center;
  padding: 10px;
}

.card-title-container p {
  margin-top: 10px;
}
.low-indicator {
  background-color: red;
  color: white;
}
</style>