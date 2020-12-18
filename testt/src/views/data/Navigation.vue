<template>
  <div class="navigation">
    <!-- 头部样式 -->
    <div class="headerStyle">
      <el-row>
        <el-col :span="3">
          <img class="imgStyle" :src="lillyImg"/>
        </el-col>
        <el-col :span="19">
          <el-menu :default-active = 'defaultTab'
                  @select="handleSelect"
                  text-color="#7D879E"
                  active-text-color="#fff"
                  background-color="#E6E7E8"
                  mode="horizontal"
                >
                  <el-menu-item index="Test">
                    <!-- <i class="el-icon-menu"></i> -->
                    <span slot="title">Overview</span>
                  </el-menu-item>
                  <el-menu-item index="MySE">
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
                  <el-menu-item index="Log">
                    <!-- <i class="el-icon-menu"></i> -->
                    <span slot="title">Log</span>
                  </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="2">
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

       <!--导航栏-->
    <div>

      <template>
          <el-breadcrumb separator="/" class='el-breadcrumb'>
            <el-breadcrumb-item>
              Home
            </el-breadcrumb-item>
           <el-breadcrumb-item>
              {{this.breadcrumbItems}}
            </el-breadcrumb-item>
          </el-breadcrumb> 
      </template>

    </div>

    <!-- 底部样式 -->
    <div class="buttomStyle">
      <el-row>
        <el-col :span="24">
          <div>
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
      breadcrumbItems: "Home",
      lillyImg: require("@/assets/Lilly.png"),
      defaultTab: ""
    };
  },

  mounted () {
    this.getRouter()
  },

  methods: {
    getRouter () {
      const url = window.location.href;
      var index = url.lastIndexOf("/");
      var primaryKey = url.substring(index + 1,url.length);
      this.handleSelect(primaryKey)
    },
    handleSelect(key) {
      this.defaultTab = key
      switch (key) {
        case "Test":
          this.$router.push("/data/Test");
          this.breadcrumbItems = "Overview";
          break;
        case "MySE":
          this.$router.push("/data/MySE");
          this.breadcrumbItems = "MySE";
          break;
        case "Log":
          this.$router.push("/data/Log");
          this.breadcrumbItems = "Log";
          break;
        case "Navigation":
          this.$router.push("/data/Test");
          break;
           case "3":
          this.$router.push("/data/My Push");
          this.breadcrumbItems = "My Push";
          break;
          case "4":
          this.$router.push("/data/My Content");
          this.breadcrumbItems = "My Content";
          break;
          case "5":
          this.$router.push("/data/Request List");
          this.breadcrumbItems = "Request List";
          break;
          case "6":
          this.$router.push("/data/Analytics");
          this.breadcrumbItems = "Analytics";
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
.el-breadcrumb{
  font-size: 25px;
}
.navigation{
  background-color: #F6F8FB; 
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
    padding-top:40%;
  }
}
.buttomStyle{
  margin-top:5px
}
.imgStyle{
  width: 60%;
  height: 55px;
  position: relative;
}
.el-menu-item.is-active {
  background-color: #5A5E6C !important;
  color: #fff;
}
</style>