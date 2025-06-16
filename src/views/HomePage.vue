<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong>Ready to create an app?</strong>
        <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>

        <ion-list>
          <ion-item v-for="order in orders" :key="order.id">
            <ion-label>{{ order.id }} - {{ order.status }}</ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,IonItem, IonLabel } from '@ionic/vue';
import Echo from 'laravel-echo';
import { onMounted, onUnmounted, ref } from 'vue';
const laravelEcho = ref<any>(null);

const orders = ref<any[]>([]);

laravelEcho.value = new Echo({
  broadcaster: 'pusher',
  key: 'your-pusher-key', // Replace with your actual Pusher key
  cluster: 'us3',
  forceTLS: true,
  authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
  bearerToken: 'your-bearer-token', // Replace with your actual bearer token
});

onMounted(() => {
  laravelEcho.value.private(`orders`)
  .listen('OrderStatusUpdated', (e: any) => {
    console.log(e.order);
    orders.value.push(e.order);
  });
});
onUnmounted(() => {
  if (laravelEcho.value) {
    laravelEcho.value.private(`orders`).stopListening(`OrderStatusUpdated`);
  }

});

</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
