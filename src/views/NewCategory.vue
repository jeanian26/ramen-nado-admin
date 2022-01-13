<template>
  <div class="container">
    <div class="navbar-container">
      <navBar></navBar>
      <pageHeader :page="page" :user="user"></pageHeader>
    </div>
    <div class="page-container" id="menuList">
      <div class="form-container">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" v-model="name" />
        <label for="imageURI">imageURI</label>
        <input type="text" id="imageURI" name="imageURI" v-model="imageURI" />
        <input type="submit" value="Submit" @click="addItem()" />
      </div>
    </div>
  </div>
</template>


<script>
import navBar from "@/components/navBar.vue";
import pageHeader from "@/components/pageHeader.vue";
import { uuid } from "vue-uuid";
import { getDatabase, ref, set,  } from "firebase/database";
import Router from "../router";

export default {
  name: "newItem",
  components: {
    navBar,
    pageHeader,
  },
  data() {
    return {
      categoryList: {},
      page: "Add New Category",
      name: "",
      imageURI: "",

    };
  },
  mounted() {
  },
  methods: {
    addItem() {
      // console.log(uuid.v4())
      let randomID = uuid.v4();
      const db = getDatabase();
      set(ref(db, "category/" + this.name), {
        imageUri: this.imageURI,
        name: this.name,
        key: randomID,
      }).then(()=>{
          alert('success')
          Router.push('/Menu')
      }).catch((error)=>{
          alert(error)
      });
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

input[type="text"],
select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type="submit"] {
  width: 100%;
  background-color: #e62222;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type="submit"]:hover {
  background-color: #e23e3e;
}
</style>