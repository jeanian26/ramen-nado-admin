<template>
  <div class="container">
    <div class="navbar-container">
      <navBar></navBar>
      <pageHeader page="Dashboard" :user="user"></pageHeader>
    </div>
    <div class="page-container">
      
      <div class="main-overview">
        <OverviewCard
          cardTitle="Orders Today"
          cardCount="10"
          icon="motorcycle"
        />
        <OverviewCard cardTitle="New Users" cardCount="10" icon="users" />
        <OverviewCard cardTitle="Low Stock" cardCount="10" icon="box" />
      </div>
      <div>
        <section id='dashboard'>
          <article>
            <h3>New Users</h3>
            <table>
              <tr>
                <th>UserID</th>
                <th>Email</th>
                <th>Name</th>
              </tr>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
              </tr>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
              </tr>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
              </tr>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
              </tr>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
              </tr>

            </table>
            <button>View All</button>
          </article>
          <article>
            <h3>New Orders</h3>
            <table>
              <tr>
                <th>UserID</th>
                <th>Email</th>
                <th>Name</th>
              </tr>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
              </tr>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
              </tr>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
              </tr>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
              </tr>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
              </tr>
            </table>
            <button>View All</button>
          </article>
        </section>
      </div>
    </div>
  </div>
</template>


<script>
import navBar from "@/components/navBar.vue";
import pageHeader from "@/components/pageHeader.vue";
import OverviewCard from "@/components/OverviewCard.vue";
import { getDatabase, ref, child, get } from "firebase/database";

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
    };
  },
  mounted() {
    this.getEvents();
  },
  methods: {
    getEvents() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, "Events/"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            console.log(typeof result);
            var size = Object.keys(result).length;
            this.eventsCount = size;
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
#dashboard {
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

#dashboard article {
  display: flex;
    height: 320px;
    width: 100%;
    flex-direction: column;
    background-color: white;
    box-shadow: 5px 5px 10px #ddd3d3;
    padding: 15px;
}

#dashboard article button {
  margin: 20px auto 0;
  padding: 10px 20px;
  border: none;
  background-color: #e62222;
  color: white;
  cursor: pointer;
  box-shadow: 5px 5px 10px #ddd3d3;
  
}
#dashboard article button:hover {

  background-color: #ee6d6d;

  
}
</style>