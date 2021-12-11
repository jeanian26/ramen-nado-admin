<template>
  <div class="container">
    <div class="navbar-container">
      <navBar></navBar>
      <pageHeader page="Orders" :user="user"></pageHeader>
    </div>
    <div class="page-container">
      <h3>Important Stats</h3>
      <div class="main-overview">
        <OverviewCard
          cardTitle="Pending Order"
          :cardCount="getNumber('pending')"
          icon="box"
        />
        <OverviewCard
          cardTitle="For Delivery"
          :cardCount="getNumber('on-the-way')"
          icon="box"
        />
        <OverviewCard
          cardTitle="Finished Order"
          :cardCount="getNumber('delivered')"
          icon="box"
        />
        <OverviewCard cardTitle="Profit Today" :cardCount="'₱ ' + getProfit()" icon="box" />
        <OverviewCard cardTitle="Low Stocks" :cardCount="stockCount" icon="box" />
        <OverviewCard cardTitle="Total Orders " :cardCount="orderCount" icon="box" />
      </div>
      <section id="orders">
        <article>
          <h3></h3>
          <table>
            <tr>
              <th>OrderID</th>
              <th>Ordered By User ID</th>
              <th>Order Status</th>
              <th>Type of Payment</th>
            </tr>
            <tr
              v-for="order in orders"
              :key="order.orderNumber"
              @click="goToOrder(order['orderUserId'], order['orderNumber'])"
            >
              <td>{{ order["orderNumber"] }}</td>
              <td>{{ order["orderUserId"] }}</td>
              <td>{{ order["orderStatus"] }}</td>
              <td>{{ order["orderPayment"] }}</td>
            </tr>
          </table>
        </article>
      </section>
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
      user: "text",
      eventsCount: "",
      orders: [],
      orderCount:0,
      stockCount:0
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let arrayData = [];
      const dbRef = ref(getDatabase());
      get(child(dbRef, "order/"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            for (const key in result) {
              for (const key2 in result[key]) {
                arrayData.push(result[key][key2]);
              }
            }
            arrayData.sort(this.dynamicSort("orderNumber"));
            this.orderCount = arrayData.length
            this.orders = arrayData;
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
        let lowStocksCount = 0
        get(child(dbRef, "products/"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            for (const key in result) {
              console.log(result[key].stock)
              if (result[key].stock <= 10){
                lowStocksCount++
              }
            }
            this.stockCount = lowStocksCount
            
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getNumber(status) {
      // delivered
      // pending
      // on-the-way
      let arrayData = this.orders;
      let count = 0;
      arrayData.forEach(function (arrayItem) {
        if (arrayItem.orderStatus === status) {
          count++;
        }
      });
      return count;
    },

    getProfit() {
      let arrayData = this.orders;
      let count = 0;
      arrayData.forEach(function (arrayItem) {
        let items = arrayItem.orderItems;
        for (let i = 0; i < items.length; i++) {
          console.log(items[i].price * items[i].quantity)
          count = count + (items[i].price * items[i].quantity)
          let extras = items[i].extra
          for (let x = 0; x < extras.length; x++){
            if(extras[x].picked){
              count = count + extras[x].price
            }
          }
        }
      });
      return count;
    },


    dynamicSort(property) {
      var sortOrder = 1;
      if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function (a, b) {
        //first in row will be the 1st
        var result =
          a[property] < b[property] ? 1 : a[property] > b[property] ? -1 : 0;
        return result * sortOrder;
      };
    },
    goToOrder(key,test){
      console.log('key',key)
      console.log('test',test)
      Router.push(`/Orders/${test}/${key}`);
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