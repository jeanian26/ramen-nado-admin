<template>
  <div class="container">
    <div class="navbar-container">
      <navBar></navBar>
      <pageHeader :page="page" :user="user"></pageHeader>
    </div>
    <div class="page-container" id="menuList">
      <div class="form-container">
        <h3>
          Order ID: {{ orderData.orderNumber }} ({{ orderData.orderStatus }})
        </h3>
        <div v-if="orderData.orderStatus === 'pending'">
          <button 
            @click="
              processOrder(
                orderData.orderUserId,
                orderData.orderNumber,
                'on-the-way'
              )
            "
          >
            START DELIVERY</button
          ><span style="margin-left: 20px"
            ><button
              class="sub-button"
              @click="
                processOrder(
                  orderData.orderUserId,
                  orderData.orderNumber,
                  'cancelled'
                )
              "
            >
              CANCEL ORDER
            </button></span
          >
        </div>

        <!-- <button style="margin-left: 20px">EDIT ORDER</button> -->
        <br />
        <br />
        <br />
        <h3>Order Details</h3>
        <table>
          <tr>
            <td><strong>Ordered By User ID</strong></td>
            <td>{{ orderData.orderUserId }}</td>
          </tr>
          <tr>
            <td><strong>Payment Type</strong></td>
            <td>{{ orderData.orderPayment }}</td>
          </tr>
          <tr>
            <td><strong>Status</strong></td>
            <td>{{ orderData.orderStatus }}</td>
          </tr>
          <tr>
            <td><strong>Address</strong></td>
            <td>{{ address }}</td>
          </tr>
          <tr>
            <td><strong>Date and Time Ordered</strong></td>
            <td>{{ orderData.orderDate }}</td>
          </tr>
        </table>
        <br />
        <br />
        <h3>User Details</h3>
        <table>
          <tr>
            <td><strong>User Email</strong></td>
            <td>{{ UserData.email }}</td>
          </tr>
          <tr>
            <td><strong>User name</strong></td>
            <td>{{ UserData.name }}</td>
          </tr>
          <tr>
            <td><strong>User Phone Number</strong></td>
            <td>{{ UserData.phone }}</td>
          </tr>
        </table>
        <br />
        <br />
        <h3>Order Items</h3>
        <table>
          <tr>
            <th class="orderItems">Item Name</th>
            <th class="orderItems">Extra</th>
            <th class="orderItems">Price</th>
            <th class="orderItems">Quantity</th>
            <th class="orderItems">Total</th>
          </tr>
          <tr v-for="items in orderData.orderItems" :key="items">
            <td>{{ items.name }}</td>
            <td>
              <div v-for="extra in items.extra" :key="extra">
                <div v-if="extra.picked">
                  <span>{{ extra.name }} ₱{{ extra.price }} </span>
                </div>
              </div>
            </td>
            <td>₱{{ items.price }}</td>
            <td>{{ items.quantity }}</td>
            <td>₱{{ computeItemTotal(items) }}</td>
          </tr>
        </table>
        <br />
        <h3><strong>TOTAL PRICE:</strong> ₱{{ total }}</h3>
      </div>
    </div>
  </div>
</template>


<script>
import navBar from "@/components/navBar.vue";
import pageHeader from "@/components/pageHeader.vue";
// import { uuid } from "vue-uuid";
import { getDatabase, ref, child, get, update } from "firebase/database";
// import Router from "../router";

export default {
  name: "newItem",
  components: {
    navBar,
    pageHeader,
  },
  data() {
    return {
      page: "Order Item",
      ordeRID: this.$route.params.key,
      UserID: this.$route.params.id,
      orderData: {},
      UserData: {},
      address: "",
      forEdit: true,
      total: 0,
    };
  },
  mounted() {
    this.getOrder();
    this.getUserDetails();
    // this.computeOverAllTotal
  },
  methods: {
    getOrder() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `order/${this.UserID}/${this.ordeRID}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            console.log(result);
            this.orderData = result;
            this.address =
              result.orderAddress.str_number +
              " " +
              result.orderAddress.street_name +
              " " +
              result.orderAddress.barangay +
              " " +
              result.orderAddress.city;

            let totalPrice = 0;
            var orderItems = result.orderItems;
            for (let items in orderItems) {
              console.log(orderItems[items]);
              totalPrice =
                totalPrice +
                orderItems[items].price * orderItems[items].quantity;
              let extras = orderItems[items].extra;
              for (let extra in extras) {
                if (extras[extra].picked === true) {
                  totalPrice = totalPrice + extras[extra].price;
                }
              }
            }
            console.log("total", totalPrice);
            this.total = totalPrice;
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getUserDetails() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `accounts/${this.UserID}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            console.log(result);
            this.UserData = result;
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    computeItemTotal(item) {
      let totalPrice;
      let extraAdd = 0;
      for (var extra in item.extra) {
        let extraItem = item.extra[extra];
        if (extraItem.picked === true) {
          extraAdd = extraAdd + extraItem.price;
        }
      }
      totalPrice = item.price * item.quantity + extraAdd;
      this.totalPrice = Array;
      return totalPrice;
    },
    processOrder(userID, orderID, status) {
      console.log("orderID", orderID);
      console.log("userID", userID);
      const db = getDatabase();
      const updates = {};
      updates[`order/${userID}/${orderID}/orderStatus`] = status;
      update(ref(db), updates).then(() => {
        location.reload();
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

tr:nth-child(even) {
  background-color: #dddddd;
}
.orderItems {
  max-width: 20%;
  width: 100%;
}
button.sub-button {
  background: grey !important;
}
</style>