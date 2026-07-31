import { createApp } from 'vue';
import MuseUI from '../src/index';
import App from './App.vue';

const app = createApp(App);
app.use(MuseUI);
app.mount('#app');
