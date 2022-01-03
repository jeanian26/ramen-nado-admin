<template>
  <div class="page-container">
    <main class="main-content">
      <div id="invoice-app">
        <div class="header">
          <div>
            <h1>Invoice</h1>
            <p>{{orderData.orderDate}}</p>
          </div>
          <div>
            <div class="section-spacer">
              <h1>Ramen Nado</h1>
              <h5>645 Magdiwang Hwy, Kawit, 4104 Cavite</h5>
              <h5>0966 877 8960</h5>
              <h5>ramennado@gmail.com</h5>
            </div>
            <div class="section-spacer">
              <p><strong>Bill to:</strong></p>
              <h5>{{UserData.name}}</h5>
              <h5>{{ address}}</h5>
              <h5>{{ UserData.email }}</h5>
              <h5>{{ UserData.phone }}</h5>
            </div>
          </div>
        </div>
          <table class="order-items"> 
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
        <table>
          <tr>
            <td>Subtotal</td>
            <td>₱ {{ computeSubtotal() }}</td>
          </tr>
          <tr>
            <td>
              <div class="cell-with-input">
                Tax
                12%
              </div>
            </td>
            <td>₱ {{ computeTax() }}</td>
          </tr>
          <tr class="text-bold">
            <td>Grand Total</td>
            <td>₱ {{ total }}.00</td>
          </tr>
        </table>
        <button v-on:click="printInvoice">Print Invoice</button>
      </div>
    </main>
  </div>
</template>

<script>
import { getDatabase, ref, child, get } from "firebase/database";

export default {
  name: "invoice",
  components: {},
  data() {
    return {
      invoiceCurrency: {
        symbol: "$",
        name: "US Dollar",
        symbol_native: "$",
        decimal_digits: 2,
        rounding: 0,
        code: "USD",
        name_plural: "US dollars",
      },
      taxRate: 20,
      discountRate: 0,
      items: [
        { description: "Item name", quantity: 0, price: 0 },
        { description: "Item name", quantity: 0, price: 0 },
      ],
      company: {
        name: "Your company name",
        contact: "Your address\nYour tel\nYour email",
      },
      client: "Client information",
      invoiceDate: "",
      page: "Order Item",
      ordeRID: this.$route.params.orderID,
      UserID: this.$route.params.userID,
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
    computeTax(){
      return  (this.total  * 0.12).toFixed(2);
    },
    computeSubtotal(){
      return (this.total - this.computeTax()).toFixed(2)
    },

    addNewItem: function () {
      this.items.push({ description: "Item name", quantity: 0, price: 0 });
    },
    deleteItem: function (index) {
      this.items.splice(index, 1);
    },
    decimalDigits: function (value) {
      return (
        this.invoiceCurrency.symbol +
        " " +
        value.toFixed(this.invoiceCurrency.decimal_digits)
      );
    },
    printInvoice: function () {
      window.print();
    },
    adjustTextAreaHeight: function (event) {
      var el = event.target;
      el.style.height = "1px";
      el.style.height = 25 + el.scrollHeight + "px";
    },
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
              // let extras = orderItems[items].extra;
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
      // let extraAdd = 0;
      // for (var extra in item.extra) {
      //   let extraItem = item.extra[extra];
      //   if (extraItem.picked === true) {
      //     extraAdd = extraAdd + extraItem.price;
      //   }
      // }
      totalPrice = item.price * item.quantity;
      this.totalPrice = Array;
      return totalPrice;
    },
  },
  computed: {
    subTotal: function () {
      var total = this.items.reduce(function (accumulator, item) {
        return accumulator + item.price * item.quantity;
      }, 0);
      return total;
    },
    discountTotal: function () {
      var total = this.subTotal * (this.discountRate / 100);
      return total;
    },
    taxTotal: function () {
      var total = (this.subTotal - this.discountTotal) * (this.taxRate / 100);
      return total;
    },
    grandTotal: function () {
      var total = this.subTotal - this.discountTotal + this.taxTotal;
      return total;
    },
  },
};
</script>

<style scoped>
body {
  background: linear-gradient(to right, #ff5f6d, #ffc371);
}
.main-content {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media print {
  .main-content {
    align-items: flex-start;
  }
}
#invoice-app {
  background-color: #faebd7;
  padding: 2rem;
  border-radius: 0.5rem;
      max-width: 800px;
    width: 100%;
}
@media (min-width: 761px) {
  .header {
    display: flex;
  }
}
@media (min-width: 761px) {
  .header > div:nth-child(-n + 1) {
    order: 1;
    flex: 1;
    text-align: right;
    padding-left: 1rem;
  }
}
.section-spacer {
  margin: 1rem 0;
}
input,
select,
textarea {
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  display: inline-block;
  transition: background-color 0.3s ease-in-out;
  width: 100%;
}
input:focus,
select:focus,
textarea:focus {
  outline-color: #ffc371;
  background-color: rgba(255, 255, 255, 0.6);
}
input:hover,
select:hover,
textarea:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
@media print {
  input,
  select,
  textarea {
    background-color: transparent;
  }
}
@media only screen and (min-width: 761px) {
  input,
  select,
  textarea {
    width: auto;
  }
}
textarea {
  width: 100%;
  min-height: 80px;
}
@media only screen and (max-width: 760px) {
  select {
    width: 100%;
  }
}
@media print {
  select {
    appearance: none;
  }
}
.company-name {
  font-size: 2rem;
}
table {
  width: auto;
  border-collapse: collapse;
  margin: 2rem 0;
}
table thead th {
  padding: 0.5rem 1rem;
}
table thead th:nth-child(-n + 1) {
  padding-left: 0;
}
table thead th:nth-last-child(-n + 1) {
  padding-right: 0;
}
table tr {
  border-bottom: 1px solid #f4d4aa;
}
table tr td {
  padding: 0.5rem 1rem;
}
table tr td:nth-child(-n + 1) {
  padding-left: 0;
}
table tr td:nth-last-child(-n + 1) {
  padding-right: 0;
}
table tr td input {
  width: 100%;
}
table tr td .cell-with-input {
  display: flex;
}
table tr td .cell-with-input input {
  margin: 0 0.2rem;
}
.responsive-table {
  width: 100%;
}
@media only screen and (max-width: 760px) {
  .responsive-table table,
  .responsive-table thead,
  .responsive-table tbody,
  .responsive-table th,
  .responsive-table td,
  .responsive-table tr {
    display: block;
  }
  .responsive-table thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
  .responsive-table tr {
    padding: 2rem 0;
  }
  .responsive-table td[data-label] {
    position: relative;
    padding-left: 40%;
    display: flex;
    align-items: center;
  }
  .responsive-table td[data-label]:before {
    content: attr(data-label);
    position: absolute;
    top: 0.5rem;
    left: 0;
    width: 35%;
    padding-right: 10px;
    white-space: nowrap;
    font-weight: bold;
  }
}
button {
  background-color: #81cf71;
  border: none;
  border-radius: 100px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}
button:focus {
  outline-color: #ffc371;
  background-color: #69c656;
}
button:hover {
  background-color: #70c95e;
}
@media print {
  button {
    display: none;
  }
}
button.is-danger {
  background-color: #ff5f6d;
}
button.is-danger:focus {
  background-color: #ff3b4c;
}
button.is-danger:hover {
  background-color: #ff4656;
}
.text-right {
  text-align: right;
}
.text-bold {
  font-weight: bold;
}
#invoice-app .order-items {
    width: 100%;
}
#invoice-app .tr:nth-child(even){
  background-color: none !important;
}
#invoice-app h5 {
    line-height: 20px;
}
</style>

