
<template>
  <div class="container" id="userslist">
    <div class="navbar-container">
      <navBar></navBar>
      <pageHeader page="Users"></pageHeader>
    </div>
    <div class="page-container">
      <button @click="showModal = true">Add New User</button>
      <table>
        <tr>
          <th>UserID</th>
          <th>Email Address</th>
          <th>Name</th>
          <th>Phone</th>
        </tr>
        <tr
          v-for="(item, index) in users"
          v-bind:key="index"
          @click="navigate(index)"
        >
          <td>{{ index }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.phone }}</td>
        </tr>
      </table>
    </div>
  </div>
  <transition name="modal" v-if="showModal" id="add-user-modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Add new user</h3>
          </div>

          <div class="modal-body">
            <label for="lname">Email</label>
            <input type="text" id="lname" placeholder="Email" v-model="email" />
            <label for="pass">Password</label>
            <input
              type="password"
              id="pass"
              v-model="password"
              placeholder="password"
            />
            <button @click="addUser">Add New User</button>
            <button @click="showModal = false" class="secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<script>
/* eslint-disable no-unused-vars */
import navBar from "@/components/navBar.vue";
import pageHeader from "@/components/pageHeader.vue";
import { getDatabase, ref, child, get } from "firebase/database";
import Router from "../router";
const axios = require("axios");

export default {
  name: "Dash-board",
  components: {
    navBar,
    pageHeader,
  },
  data() {
    return {
      users: {},
      showModal: false,
      email: "",
      password: "",
      // For Localhost
      // url: 'http://127.0.0.1:5000',
      // For Live
      url: "https://ramenadmin.pythonanywhere.com"
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    addUser() {
      let content = {
        email: this.email,
        password: this.password,
      };
      console.log(content);

      axios
        .post(this.url, content, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data === "Success") {
            this.email = 0;
            this.password = 0;
            this.showModal = false;
            this.getData()
            alert('Success')
          }else{
            alert(response.data)
          }
        })
        .catch((e) => alert(e));
    },

    navigate(userID) {
      Router.push("/users/" + userID);
    },
    getData() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, "accounts/"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            this.users = snapshot.val();
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
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

/* tr:nth-child(even) {
  background-color: #dddddd;
} */

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

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #e62222;
}

.modal-body {
  margin: 20px 0;
}

.modal-body input[type="text"],
.modal-body input[type="password"],
select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-body input[type="submit"] {
  width: 100%;
  background-color: #e62222;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

#userslist button {
  padding: 10px 20px;
  border: none;
  background-color: #e62222;
  color: white;
  cursor: pointer;
  box-shadow: 5px 5px 10px #ddd3d3;
}

#add-user-modal button {
  padding: 10px 20px;
  border: none;
  background-color: #e62222;
  color: white;
  cursor: pointer;
  box-shadow: 5px 5px 10px #ddd3d3;
  width: 100%;
  margin: 10px 0 0 0;
}
#add-user-modal .secondary {
  margin-top: 20px;
  background-color: #e6222200 !important;
  color: #e62222;
  border: 1px solid #e62222;
}
</style>