import { MessageBox } from "element-ui";
import router from '../router'

  export default {
    Message() {
        MessageBox.alert("登陆信息无效或已过期，请登陆后再访问", "提示", {
            confirmButtonText: "确定",
            callback: action => {
                console.log("action:" + action);
                var route ={
                    path: '/users/login',
                    alias: '/login',
                    name: 'login',
                    component: () => import('../views/user/login.vue')
                }      
                router.push(route)
            }
        });
      
      }
  }