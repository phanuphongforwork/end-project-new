<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item class="d-lg-none d-lg-flex">
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            ระบบทะเบียนครัวเรือน
          </v-list-item-title>
          <!-- <v-list-item-subtitle> subtext </v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav dense>
        <div v-for="(item, i) in menus" :key="i" v-if="active(item)">
          <div v-if="item && item.subMenus.length > 0" class="mt-4">
            <v-subheader>
              <h2>
                <p class="font-weight-black">{{ item.title }}</p>
              </h2>
            </v-subheader>
            <v-list-item-group color="primary">
              <v-list-item
                v-for="(menu, index) in item.subMenus"
                :key="index"
                :class="{
                  'v-list-item--active': menu.active === true,
                }"
                v-if="show(menu)"
                nuxt
                :to="menu.to"
              >
                <v-list-item-icon>
                  <v-icon v-text="menu.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="menu.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" dark dense app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <!-- <v-toolbar-title>ระบบทะเบียนครัวเรือน</v-toolbar-title> -->

      <v-spacer></v-spacer>

      <!-- <v-menu >
        <template v-slot:activator="{ on }">

          
          <v-btn color="primary" depressed v-on="on">
            <v-icon left> mdi-account-circle-outline </v-icon>
            Admin
          </v-btn>
        </template>
      </v-menu> -->

      <v-menu bottom left class="d-md-none d-lg-flex" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" depressed v-on="on">
            <v-icon left> mdi-account-circle-outline </v-icon>
            {{ (person && person.person_name) || "-" }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item nuxt to="/login">
            <v-list-item-title>ออกจากระบบ</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <Nuxt></Nuxt>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import menus from "@/constants/menu";
import Breadcrumbs from "@/components/Breadcrumbs";
import menu from "../constants/menu";

export default {
  components: {
    Breadcrumbs,
  },
  data() {
    return {
      drawer: true,
      lists: [{ text: "Log Out", icon: "mdi-logout" }],
      selectedItem: 1,
      menus,
    };
  },
  watch: {
    "$auth.user": {
      immediate: true,
      handler(data) {
        if (!data) {
          this.$router.push("/login");
        }
      },
    },
  },
  computed: {
    person() {
      return this.$auth.user;
    },
  },
  methods: {
    show(submenu) {
      if (submenu && submenu.level && submenu.level.length > 0) {
        const myLevel = this.$auth.user.role;
        return submenu.level.some((item) => {
          return item === Number(myLevel);
        });
      }

      return false;
    },
    active(menu) {
      let countActive = 0;
      if (menu) {
        if (menu.subMenus && menu.subMenus.length > 0) {
          menu.subMenus.forEach((sub) => {
            const isShow = this.show(sub);

            if (isShow) {
              countActive += 1;
            }
          });
        }
      }
      return countActive === 0 ? false : true;
    },
  },
};
</script>

<style>
.bg-active {
  background-color: black;
  color: white !important;
}
</style>
