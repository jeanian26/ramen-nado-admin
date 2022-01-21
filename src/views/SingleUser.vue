<template>
  <div class="container" id="single-users">
    <div class="navbar-container">
      <navBar></navBar>
      <pageHeader page="Users"></pageHeader>
    </div>
    <div class="page-container">
      <h3>User Details</h3>
      <table>
        <tr>
          <td><strong>User ID</strong></td>
          <td>{{ UserID }}</td>
        </tr>
        <tr>
          <td><strong>User Email</strong></td>
          <td>{{ UserData.email }}</td>
        </tr>
        <tr>
          <td><strong>User name</strong></td>
          <td contenteditable @input="(event) => onChangeName(event)">
            {{ UserData.name }}
          </td>
        </tr>
        <tr>
          <td><strong>User Phone Number</strong></td>
          <td contenteditable @input="(event) => onChangePhone(event)">
            {{ UserData.phone }}
          </td>
        </tr>
        <tr>
          <td><strong>Rider</strong></td>
          <td>
            <input
              type="checkbox"
              name=""
              id=""
              v-model="UserData.rider"
              @click="testClick()"
            />
          </td>
        </tr>
        <tr>
          <td><strong>Admin</strong></td>
          <td>
            <input type="checkbox" name="" id="" v-model="UserData.admin" />
          </td>
        </tr>
        <tr>
          <td><strong>Email Verified</strong></td>
          <td>
            <input type="checkbox" name="" id="" v-model="UserData.emailVerified" disabled/>
          </td>
        </tr>
        <tr>
          <td><strong>Phone Verified</strong></td>
          <td>
            <input type="checkbox" name="" id="" v-model="UserData.phoneVerified" disabled/>
          </td>
        </tr>
      </table>
      <br />
      <h3>User Address</h3>
      <table>
        <tr>
          <td><strong>Barangay</strong></td>
          <td contenteditable @input="(event) => onChangeAddress(event)">
            {{ Address.barangay }}
          </td>
        </tr>
        <tr>
          <td><strong>City</strong></td>
          <td contenteditable @input="(event) => onChangeCity(event)">
            {{ Address.city }}
          </td>
        </tr>
        <tr>
          <td><strong>House Number</strong></td>
          <td contenteditable @input="(event) => onChangeStreetNumber(event)">
            {{ Address.str_number }}
          </td>
        </tr>
        <tr>
          <td><strong>Street Name</strong></td>
          <td contenteditable @input="(event) => onChangeStreetName(event)">
            {{ Address.street_name }}
          </td>
        </tr>
        <tr>
          <td><strong>Zipcode</strong></td>
          <td contenteditable @input="(event) => onChangeZipcode(event)">
            {{ Address.zipcode }}
          </td>
        </tr>
      </table>
      <button @click="test()">Update</button>
      <button @click="deleteUser()" class="delete-btn">Delete</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import navBar from "@/components/navBar.vue";
import pageHeader from "@/components/pageHeader.vue";
// import { uuid } from "vue-uuid";
import { getDatabase, ref, child, get, update } from "firebase/database";
import Router from "../router";
const axios = require("axios");

export default {
  name: "newItem",
  components: {
    navBar,
    pageHeader,
  },
  data() {
    return {
      page: "Order Item",
      UserID: this.$route.params.userID,
      UserData: {},
      Address: {},
      // For Localhost
      // url: "http://127.0.0.1:5000",
      // For Live
      url: "https://ramenadmin.pythonanywhere.com"
    };
  },
  mounted() {
    this.getUserDetails();
  },
  methods: {
    testClick() {
      let rider = this.UserData.rider;
    },
    test() {
      const db = getDatabase();
      const updates = {};
      updates[`accounts/${this.UserID}/name`] = this.UserData.name
        ? this.UserData.name
        : "";
      updates[`accounts/${this.UserID}/phone`] = this.UserData.phone;
      updates[`accounts/${this.UserID}/admin`] = this.UserData.admin
        ? this.UserData.admin
        : false;
      updates[`accounts/${this.UserID}/rider`] = this.UserData.rider
        ? this.UserData.rider
        : false;
      updates[`address/${this.UserID}/barangay`] = this.Address.barangay
        ? this.Address.barangay
        : "";
      updates[`address/${this.UserID}/city`] = this.Address.city
        ? this.Address.city
        : "";
      updates[`address/${this.UserID}/str_number`] = this.Address.str_number
        ? this.Address.str_number
        : "";
      updates[`address/${this.UserID}/street_name`] = this.Address.street_name
        ? this.Address.street_name
        : "";
      updates[`address/${this.UserID}/zipcode`] = this.Address.zipcode
        ? this.Address.zipcode
        : "";
      update(ref(db), updates).then(() => {
        alert("Successfully Updated User Account");
      });
    },
    onChangeName(e) {
      this.UserData.name = e.target.innerText;
    },
    onChangePhone(e) {
      this.UserData.phone = e.target.innerText;
    },
    onChangeAddress(e) {
      this.Address.barangay = e.target.innerText;
    },
    onChangeCity(e) {
      this.Address.city = e.target.innerText;
    },
    onChangeStreetNumber(e) {
      this.Address.str_number = e.target.innerText;
    },
    onChangeStreetName(e) {
      this.Address.street_name = e.target.innerText;
    },
    onChangeZipcode(e) {
      this.Address.zipcode = e.target.innerText;
    },

    getUserDetails() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `accounts/${this.UserID}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            this.UserData = result;
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      get(child(dbRef, `address/${this.UserID}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            this.Address = result;
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteUser() {
      var confirmDelete = window.confirm("Delete User?");
      if (confirmDelete) {
        let id = this.UserID;
        axios
          .delete(`${this.url}?uid=${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((r) => {
            console.log(r);
            Router.push("/Users");
          })
          .catch((e) => alert(e));
      } else {
        return;
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

table {
  margin-top: 15px;
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
/* td {
    max-width: 50%;
    width: 100%;
} */

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

/* tr:nth-child(even) {
  background-color: #dddddd;
} */
.orderItems {
  max-width: 20%;
  width: 100%;
}
button {
  margin: 20px auto 0;
  padding: 10px 20px;
  border: none;
  background-color: #e62222;
  color: white;
  cursor: pointer;
  box-shadow: 5px 5px 10px #ddd3d3;
}
.delete-btn {
  float: right;
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid #e62222;
  color: #e62222;
}
</style>