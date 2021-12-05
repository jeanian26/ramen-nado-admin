<template>
  <div class="overviewCard">
    <div class="overviewCard-icon overviewCard-icon--document">
      <font-awesome-icon :icon="['fas', icon]" /> 
    </div>
    <div class="overviewCard-description">
      <h3 class="overviewCard-title text-light">
        {{cardTitle}}
      </h3>
      <p class="overviewCard-subtitle">{{cardCount}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "OverviewCard",
  props: {
    cardTitle: String,
    cardCount: String,
    icon:String,
  },
};
</script>

<style>
.overviewCard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #fff;
  transform: translateY(0);
  transition: all 0.3s;
}
.overviewCard-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 60px;
  border-radius: 50%;
  font-size: 21px;
  color: #fff;
}
.overviewCard-icon--document {
  background-color: #e62222;
}

.overviewCard-description {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.overviewCard-title {
  font-size: 18px;
  color: #1bbae1;
  margin: 0;
}
.overviewCard-subtitle {
  margin: 2px;
  color: #777;
  font-size: 30px;
}
.overviewCard:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

/* end cars */
</style>