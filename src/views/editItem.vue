<template>
  <div class="container">
    <div class="navbar-container">
      <navBar></navBar>
      <pageHeader :page="page" :user="user"></pageHeader>
    </div>
    <div class="page-container" id="menuList">
      <h3>ID: {{ this.$route.params.key }}</h3>
      <br />
      <div class="form-container">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" v-model="name" />

        <label for="description">description</label>
        <input
          type="text"
          id="description"
          name="description"
          v-model="description"
        />
        <label for="imageURI">imageURI</label>
        <input type="text" id="imageURI" name="imageURI" v-model="imageURI" />
        <label for="price">price</label>
        <input
          type="text"
          id="price"
          name="price"
          @keypress="validate(event)"
          v-model="price"
        />
        <label for="stock">Stock in PCS</label>
        <input
          type="text"
          id="stock"
          name="stock"
          @keypress="validate(event)"
          v-model="stock"
        />
        <label for="Category">Category</label>
        <select id="Category" name="Category" v-model="category">
          <option v-for="(value, key) in categoryList" :key="key">
            {{ key }}
          </option>
        </select>

        <input type="checkbox" id="Popular" name="Popular" v-model="popular" />
        <label style="margin-left: 5px" for="Popular">Popular</label>
        <br />
        <br />
        <input type="checkbox" id="extra" name="extra" v-model="extra" />
        <label style="margin-left: 5px" for="extra">extra</label>

        <input type="submit" value="Submit" @click="updateItem()" />
      </div>
      <br />
      <button @click="deleteItem()">DELETE</button>
    </div>
  </div>
</template>


<script>
import navBar from "@/components/navBar.vue";
import pageHeader from "@/components/pageHeader.vue";
// import { uuid } from "vue-uuid";
import { getDatabase, ref, child, get, update, set } from "firebase/database";
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
      page: "Edit Item",
      name: "",
      description: "",
      imageURI: "",
      price: "",
      category: "",
      popular: false,
      extra: false,
      stock: "",
      key: "",
    };
  },
  mounted() {
    this.getCategory();
    this.getData();
  },
  methods: {
    validate(evt) {
      var theEvent = evt || window.event;

      // Handle paste
      if (theEvent.type === "paste") {
        key = event.clipboardData.getData("text/plain");
      } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
      }
      var regex = /[0-9]|\./;
      if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
      }
    },
    getData() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, "products/" + this.$route.params.key))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            console.log(result);
            this.category = result.Category;
            this.description = result.description;
            if (typeof result.extra === "undefined") {
              this.extra = false;
            } else {
              this.extra = result.extra;
            }
            if (typeof result.Popular === "undefined") {
              this.popular = false;
            } else {
              this.popular = result.Popular;
            }
            this.imageURI = result.imageUri;
            this.key = result.key;
            this.name = result.name;
            this.price = parseInt(result.price);
            this.rating = result.rating;
            this.stock = result.stock;
            console.log(this.extra);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getCategory() {
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
    updateItem() {
      const db = getDatabase();
      const updates = {};
      updates[`products/${this.key}/Category`] = this.category;
      updates[`products/${this.key}/Popular`] = this.popular;
      updates[`products/${this.key}/description`] = this.description;
      updates[`products/${this.key}/extra`] = this.extra;
      updates[`products/${this.key}/imageUri`] = this.imageURI;
      updates[`products/${this.key}/name`] = this.name;
      updates[`products/${this.key}/price`] = this.price;
      updates[`products/${this.key}/stock`] = this.stock;
      update(ref(db), updates).then(() => {
        Router.push("/Menu/" + this.$route.params.category);
      });
    },
    deleteItem() {
      var answer = window.confirm("Delete Product");
      if (answer) {
        const db = getDatabase();
        set(ref(db, "products/" + this.$route.params.key), {})
          .then(() => {
            alert("sucess");
            Router.push("/Menu");
          })
          .catch((error) => {
            alert(error);
          });
      }
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