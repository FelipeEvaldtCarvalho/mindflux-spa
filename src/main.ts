import PrimeVue, { primeVueOptions } from "./plugins/primevue";
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

import "primeicons/primeicons.css";
import "./style.css";

const app = createApp(App);

app.use(PrimeVue, primeVueOptions);
app.use(router);
app.use(ToastService);
app.use(ConfirmationService);
app.mount("#app");
