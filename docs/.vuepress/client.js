import { defineClientConfig } from '@vuepress/client';
import vitoImage from './components/vitoImage.vue';

export default defineClientConfig({
  enhance({ app }) {
    app.component('vitoImage', vitoImage);
  },
});
