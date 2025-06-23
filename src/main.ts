import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { alertController, IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import OneSignal, { NotificationClickEvent, NotificationWillDisplayEvent } from 'onesignal-cordova-plugin';

const app = createApp(App)
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');

  OneSignal.initialize("1ebd3376-bf83-40bd-9172-9435856f28d1");
  // Use this method to prompt for push notifications.
  // We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
  OneSignal.Notifications.requestPermission();
  // OneSignal.Notifications.requestPermission(false).then((accepted: boolean) => {
  //   console.log("User accepted notifications: " + accepted);
  // });

  const interval = setInterval(async () => {

    const id = await OneSignal.User.getOnesignalId();
    console.log('OnesignalId', id);

    if (id) {
      clearInterval(interval);
      /// logica para guardar el id en la base de datos
    }

  }, 60000);


  const myClickListener = async function (event: NotificationClickEvent) {
    const notificationData = JSON.stringify(event);
    console.log(notificationData);
    presentAlert(event.notification.body);
   
  };

  OneSignal.Notifications.addEventListener("click", myClickListener);



    const displayNotification = (event: NotificationWillDisplayEvent) => {
    // Use preventDefault() to not display
    // event.preventDefault();
    // Use notification.display() to display the notification after some async work
    event.getNotification().display();

    console.log("OneSignal notification received:", JSON.stringify(event.getNotification()));
     presentAlert(event.getNotification().body);
   
   
}
OneSignal.Notifications.addEventListener("foregroundWillDisplay", displayNotification);



});


async function presentAlert(message:string) {
  const alert = await alertController.create({
    header: 'Notificacion',
    message,
    buttons: ['OK'],
  });

  await alert.present();
}

