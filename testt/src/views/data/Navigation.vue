<template>
  <div class="navigation">
    <!-- 头部样式 -->
    <div class="headerStyle">
      <el-row>
        <el-col :span="4">
          <img class="imgStyle" :src="lillyImg"/>
        </el-col>
        <el-col :span="16">
          <el-menu default-active="1"
                  @select="handleSelect"
                  text-color="#7D879E"
                  active-text-color="#fff"
                  background-color="#E6E7E8"
                  mode="horizontal"
                >
                  <el-menu-item index="1">
                    <!-- <i class="el-icon-menu"></i> -->
                    <span slot="title">Overview</span>
                  </el-menu-item>
                  <el-menu-item index="2">
                    <span slot="title">MySE</span>
                  </el-menu-item>
                  <el-menu-item index="3">
                    <span slot="title">My Push</span>
                  </el-menu-item>
                  <el-menu-item index="4">
                    <span slot="title">My Content</span>
                  </el-menu-item>
                  <el-menu-item index="5">
                    <span slot="title">Request List</span>
                  </el-menu-item>
                  <el-menu-item index="6">
                    <span slot="title">Analytics</span>
                  </el-menu-item>
                  <el-menu-item index="7">
                    <!-- <i class="el-icon-menu"></i> -->
                    <span slot="title">Log</span>
                  </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="4">
          <el-dropdown trigger="click">
              <div class="headerStyle__logout">
                admin<i class="el-icon-caret-bottom"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </el-col>
      </el-row>
    </div> 
    <!-- 底部样式 -->
    <div>
      <el-row>
        <el-col :span="24">
          <div style="margin-top: 10px">
            <router-view></router-view>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import variables from "@/styles/variables.scss";
import UserService from "../../services/UserService";
export default {
  data() {
    return {
      searchCriteria: "",
      breadcrumbItems: ["导航一"],
      lillyImg: require("@/assets/Lilly.png"),
    };
  },

  methods: {
    handleSelect(key) {
      switch (key) {
        case "1":
          this.$router.push("/data/Test");
          this.breadcrumbItems = ["Test"];
          break;
        case "2":
          this.$router.push("/data/MySE");
          this.breadcrumbItems = ["MySE"];
          break;
        case "7":
          this.$router.push("/data/Log");
          this.breadcrumbItems = ["Log"];
          break;
      }
    },
    variables() {
      return variables;
    },
    logout() {
       function pp1()
      {
          var pp =  UserService.getQRCode()
          return pp
      }
      var ii = pp1()
      alert(ii)
      this.$router.push({
        name: "login",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.navigation{
  background-color: #F6F8FB; 
  min-height: 600px; 
  margin-left: 0px;
margin-top: 0px;
}
.headerStyle{
  height: 40%;
  width: 100%;
  background-color:#E6E6EA;
  overflow: hidden;
  &__logout {
    color: #7D879E;
    text-align:center;
    padding-top:40%
  }
}
.imgStyle{
  width: 60%;
  height: 50px;
  position: relative;
}
.el-menu-item.is-active {
  background-color: #5A5E6C !important;
  color: #fff;
}
</style>