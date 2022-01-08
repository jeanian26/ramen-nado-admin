<template >
  <div class="centered">
    <h2>
      Paypal Payment <strong>{{ status }}</strong>
    </h2>
    <br />
    <p>Go Back to the Ramen-Nado Application</p>
    <br />
  </div>
</template>

<script>
export default {
  name: "paypal",
  components: {},
  data() {
    return {
      status: this.$route.params.status,
    };
  },
};
</script>

<style>
.centered {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>