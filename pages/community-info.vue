<template>
    <div>
      <div>
        <Breadcrumb :items="breadcrumbs" :title="title" />
      </div>
      <div>
        <v-btn
          color="primary"
          large
          class="col-12 col-lg-2 mt-6"
          @click="modalActive = true"
        >
          <v-icon left> mdi-plus-circle </v-icon>
          เพิ่มชุมชน
        </v-btn>
      </div>
      <v-card class="mt-6" outlined>
        <v-data-table
          :headers="headers"
          :items="roles"
          disable-filtering
          disable-sort
          :itemsPerPage="5"
          class="elevation-1"
        >
          <template v-slot:[`item.role`]="{ item }" class="d-flex justify-center">
            <v-chip color="info" dark>
              {{ item.role }}
            </v-chip>
          </template>
  
          <template
            v-slot:[`item.Status`]="{ item }"
            class="d-flex justify-center"
          >
            <v-chip color="primary" dark>
              {{ item.Status }}
            </v-chip>
          </template>
  
          <template v-slot:[`item.actions`]>
            <a href="#" @click="editAccount()">แก้ไขบัญชี</a>
          </template>
        </v-data-table>
      </v-card>
  
      <v-dialog
        v-model="modalActive"
        hide-overlay
        persistent
        transition="dialog-bottom-transition"
        max-width="800"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="closeModal()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title
              >{{ isEdit ? "แก้ไข" : "สร้าง" }}{{ title }}</v-toolbar-title
            >
            <v-spacer></v-spacer>
          </v-toolbar>
          <div class="px-4 py-4">
            <CreateAccount
              :isEdit="isEdit"
              @createAccount="handleCreateAccount()"
            />
          </div>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import CreateAccount from "@/components/accounts/CreateAccount";
  import Breadcrumb from "@/components/Breadcrumbs";
  export default {
    components: {
      Breadcrumb,
      CreateAccount,
    },
    data() {
      return {
        modalActive: false,
        title: "ข้อมูลชุมชน",
        breadcrumbs: [
          {
            text: "หน้าแรก",
            disabled: false,
            href: "/",
          },
          {
            text: "ข้อมูลชุมชน",
            disabled: false,
            href: "accounts",
          },
        ],
        search: "",
        page: 1,
        headers: [
          {
            text: "ลำดับที่",
            value: "index",
            width: 100,
          },
          {
            text: "ชื่อชุมชน",
            align: "start",
            sortable: false,
            value: "Username",
          },
        ],
      };
    },
  };
  </script>
  
  <style>
  table {
    border: none;
    border-collapse: collapse;
  }
  table td {
    border-left: 1px solid #dddddd;
  }
  table td:first-child {
    border-left: none;
  }
  </style>
  