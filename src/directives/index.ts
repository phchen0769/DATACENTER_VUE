// import print from 'vue3-print-nb'
import permission from './permission'

export default (app: any) => {
  //   app.use(print)
  app.directive('permission', permission)
}
