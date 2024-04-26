import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const options = {
    toastClassName: "toast",
    showCloseButtonOnHover: true,
    closeButtonClassName: "toast-close",
    hideProgressBar: false,
    timeout: 2500,
    maxToasts: 3
}

export default ({ app }, inject) => {
  app.use(Toast, options);
}