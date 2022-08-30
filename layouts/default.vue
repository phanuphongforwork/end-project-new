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
        <div v-for="(item, i) in items" :key="i">
          <v-subheader>{{ item.title }}</v-subheader>
          <v-list-item-group color="primary">
            <v-list-item
              :class="{
                'v-item--active': menu.active === true,
                'v-list-item--active': menu.active === true,
              }"
              v-for="(menu, i) in item.subMenus"
              :key="i"
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
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" dark dense app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <!-- <v-toolbar-title>ระบบทะเบียนครัวเรือน</v-toolbar-title> -->

      <v-spacer></v-spacer>

      <v-menu bottom left class="d-md-none d-lg-flex">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" depressed v-on="on">
            <v-icon left> mdi-account-circle-outline </v-icon>
            Admin
          </v-btn>
        </template>
      </v-menu>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-row>
          <v-col>
            <Breadcrumbs class="mt-6" />
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-h4"> ทะเบียนครัวเรือน </v-col>
        </v-row>

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
import Breadcrumbs from "@/components/Breadcrumbs";

export default {
  components: {
    Breadcrumbs,
  },
  data() {
    return {
      drawer: true,

      lists: [{ text: "Log Out", icon: "mdi-logout" }],
      selectedItem: 1,
      items: [
        {
          title: "จัดการบทบาท",
          subMenus: [
            {
              text: "บทบาท",
              icon: "mdi-shield-check",
              active: false,
            },
            {
              text: "แก้ไขบทบาท",
              icon: "mdi-shield-edit ",
              active: false,
            },
            { text: "ลบบทบาท", icon: "mdi-delete-forever ", active: false },
          ],
        },
        {
          title: "จัดการผู้ใช้งาน",
          subMenus: [
            {
              text: "บัญชีผู้ใช้งาน",
              icon: "mdi-account-box ",
              active: false,
            },
            {
              text: "แก้ไขบัญชีผู้ใช้งาน",
              icon: "mdi-account-edit  ",
              active: false,
            },
            {
              text: "ลบบัญชีผู้ใช้งาน",
              icon: "mdi-delete-forever",
              active: false,
            },
          ],
        },
        {
          title: "จัดการทะเบียนครัวเรือน",
          subMenus: [
            {
              text: "ทะเบียนครัวเรือน",
              icon: "mdi-book-open-variant ",
              active: true,
            },
            {
              text: "แก้ไขทะเบียนครัวเรือน",
              icon: "mdi-file-document-edit",
              active: false,
            },
            { text: "ลบทะเบียนครัวเรือน", icon: "mdi-delete-forever" },
          ],
        },
        {
          title: "จัดการบุคคลในครัวเรือน",
          subMenus: [
            {
              text: "บุคคลในครัวเรือน",
              icon: "mdi-account-multiple",
              active: false,
            },
            {
              text: "แก้ไขบุคคลในครัวเรือน",
              icon: "mdi-account-wrench",
              active: false,
            },
            {
              text: "ลบบุคคลในครัวเรือน",
              icon: "mdi-account-multiple-remove ",
            },
          ],
        },
      ],
    };
  },

  watch: {},
};
</script>
