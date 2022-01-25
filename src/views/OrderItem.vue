<template>
  <div class="container">
    <div class="navbar-container">
      <navBar></navBar>
      <pageHeader :page="page" :user="user"></pageHeader>
    </div>
    <div class="page-container" id="menuList">
      <div class="form-container">
        <h3>Order ID: {{ orderData.orderNumber }} ({{ statusText }})</h3>
        <div>
          <button style="margin-right: 20px"
            v-if="orderData.orderStatus === 'pending'"
            @click="
              processOrder(
                orderData.orderUserId,
                orderData.orderNumber,
                'preparing'
              )
            "
          >
            START PREPARING
          </button>
          <button style="margin-right: 20px"
            v-if="orderData.orderStatus === 'preparing'"
            @click="
              showModal = true
            "
          >
            START DELIVERY
          </button>
          <span>
            <button v-if="(orderData.orderStatus !== 'cancelled') && (orderData.orderStatus !== 'returned') && (orderData.orderStatus !== 'delivered') "
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
            </button>
          </span>
        </div>
        <span
          ><button v-if="(orderData.orderStatus !== 'cancelled') && (orderData.orderStatus !== 'returned')"
            class="sub-button"
            @click="gotoInvoice(orderData.orderUserId, orderData.orderNumber)"
          >
            INVOICE
          </button></span
        >

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
          <tr>
            <td><strong>Date and Time Preparing</strong></td>
            <td>{{ orderData.Start_preparing }}</td>
          </tr>
          <tr>
            <td><strong>Date and Time Delivery</strong></td>
            <td>{{ orderData.Start_delivery }}</td>
          </tr>
          <tr>
            <td><strong>Time Estimate</strong></td>
            <td>{{ orderData.timeEstimate }}</td>
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
      <transition name="modal" v-if="showModal" id="add-user-modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Time Estimate</h3>
          </div>
          <div class="modal-body">
            <select v-model="timeEstimate" required>
              <option value="15 MINS">15 mins</option>
              <option value="30 MINS">30 mins</option>
              <option value="45 MINS">45 mins</option>
              <option value="60 MINS">60 mins</option>
              <!-- <option value="100">More than 1hr</option> -->
            </select>
            <button @click="processOrder(
                orderData.orderUserId,
                orderData.orderNumber,
                'on-the-way'
              )">Set Time Estimate</button>
            <button @click="showModal = false" class="secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  </div>
</template>


<script>
import navBar from "@/components/navBar.vue";
import pageHeader from "@/components/pageHeader.vue";
// import { uuid } from "vue-uuid";
import { getDatabase, ref, child, get, update } from "firebase/database";
import Router from "../router";

export default {
  name: "newItem",
  components: {
    navBar,
    pageHeader,
  },
  data() {
    return {
      page: "Order Item",
      showModal:false,
      ordeRID: this.$route.params.key,
      UserID: this.$route.params.id,
      orderData: {},
      UserData: {},
      address: "",
      forEdit: true,
      total: 0,
      statusText: "",
      timeEstimate:'15 MINS'
    };
  },
  mounted() {
    this.getOrder();
    this.getUserDetails();
    // this.computeOverAllTotal
  },
  methods: {
    setOrderStatusText(status) {
      switch (status) {
        case "pending":
          this.statusText = "Pending";
          break;
        case "preparing":
          this.statusText = "The order is approved and being made";
          break;
        case "on-the-way":
          this.statusText = "The order is out for delivery";
          break;
        case "delivered":
          this.statusText = "Delivered";
          break;
        case "cancelled":
          this.statusText = "Cancelled";
          break;
        case "returned":
          this.statusText = "Returned";
          break;
        default:
        // code block
      }
    },
    getOrder() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `order/${this.UserID}/${this.ordeRID}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            console.log(result);
            this.orderData = result;
            this.setOrderStatusText(result.orderStatus);
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
              // let extras = orderItems[items].extra;
              console.log("test", totalPrice);

              // for (let extra in extras) {
              //   if (extras[extra].picked === true) {
              //     totalPrice = totalPrice + extras[extra].price;
              //   }
              // }
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
      console.log("extras", extraAdd);
      totalPrice = item.price * item.quantity;
      console.log(item.price);
      this.totalPrice = Array;
      return totalPrice;
    },
    processOrder(userID, orderID, status) {
      console.log("orderID", orderID);
      console.log("userID", userID);
      const db = getDatabase();
      const updates = {};
      if (status === 'preparing'){
      updates[`order/${userID}/${orderID}/Start_preparing`] = Date(Date.now());
      }
      else if(status === 'on-the-way'){
      updates[`order/${userID}/${orderID}/timeEstimate`] = this.timeEstimate;
      updates[`order/${userID}/${orderID}/Start_delivery`] = Date(Date.now());
      }
      updates[`order/${userID}/${orderID}/orderStatus`] = status;
      update(ref(db), updates).then(() => {
        location.reload();
      });
    },
    gotoInvoice(userID, orderID) {
      console.log(userID, orderID);
      Router.push(`/invoice/${orderID}/${userID}`);
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
button.sub-button {
  background: grey !important;
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