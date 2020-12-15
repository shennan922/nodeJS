<template>
  <div
    id="test"
    style="background-color: #ebebeb; min-height: 600px; margin-top: -60px"
  >
    <div
      style="
        height: 50%;
        width: 100%;
        background-color: #242f42;
        overflow: hidden;
      "
    >
      <span style="float: left; color: white; margin-left: 1%">
        <img :src="lillyImg" style="width: 160px; height: 70px" />
      </span>

      <span style="float: right; padding-top: 30px; margin-right: 1%">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link" style="color: white">
            admin<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>个人信息</el-dropdown-item> -->
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>

    <div>
      <el-row>
        <el-col :span="4">
          <div style="text-align: left">
            <el-menu
              default-active="1"
              style="min-height: 900px"
              @select="handleSelect"
              text-color="#fff"
              active-text-color="#409EFF"
              background-color="#304156"
            >
              <el-menu-item index="1">
                <i class="el-icon-menu"></i>
                <span slot="title">Overview</span>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">MySE</span>
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-menu"></i>
                <span slot="title">My Push</span>
              </el-menu-item>
              <el-menu-item index="4">
                <i class="el-icon-menu"></i>
                <span slot="title">My Content</span>
              </el-menu-item>
              <el-menu-item index="5">
                <i class="el-icon-menu"></i>
                <span slot="title">Request List</span>
              </el-menu-item>
              <el-menu-item index="6">
                <i class="el-icon-menu"></i>
                <span slot="title">Analytics</span>
              </el-menu-item>
              <el-menu-item index="7">
                <i class="el-icon-menu"></i>
                <span slot="title">Log</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="20">
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
        case "3":
          this.$router.push("/data/Test");
          this.breadcrumbItems = ["Test"];
          break;
        case "4":
          this.$router.push("/data/Test");
          this.breadcrumbItems = ["Test"];
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
      this.$router.push({
        name: "login",
      });
    },
  },
};
</script>

<style scoped>
</style>