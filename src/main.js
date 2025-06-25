import { createApp } from 'vue'
import { Quasar, Dark } from 'quasar' // Import Dark plugin

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import './style.css'
import App from './App.vue'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {
    Dark // Add Dark plugin here
  },
})

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
