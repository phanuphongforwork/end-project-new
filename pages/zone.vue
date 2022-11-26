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
            @click="modalActive = true">
            <v-icon left> mdi-plus-circle </v-icon>
            เพิ่มเขต
          </v-btn>
        </div>
      <v-card class="mt-6" outlined>
        <v-card-title class="col-12">
          <div class="col-12">
            <v-text-field
              class="col-12"
              append-icon="mdi-magnify"
              label="ค้นหาเขต"
              single-line
              hide-details
              outlined
            ></v-text-field>
          </div>
  
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="desserts"
          disable-filtering
          disable-sort
          :itemsPerPage="5"
          class="elevation-1"
        >
          <template v-slot:[`item.actions`]>
            <a href="#">กดเพื่อเพิ่ม</a>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog
        v-model="modalActive"
        hide-overlay
        transition="dialog-bottom-transition"
        max-width="800"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="modalActive = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>เพิ่มเขต</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <div class="px-4 py-4">
            <AddZone @save="save()" />
          </div>
        </v-card>
      </v-dialog>
  
      <v-btn
        fab
        dark
        large
        color="primary"
        fixed
        right
        bottom
        class="d-block d-lg-none"
      >
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </div>
  </template>
  
  <script>
  import AddZone from "@/components/basic/AddZone";
  import Breadcrumb from "@/components/Breadcrumbs";
  export default {
    components: {
      Breadcrumb,
      AddZone,
    },
  
    data() {
      return {
        title: "เขต",
        breadcrumbs: [
          {
            text: "หน้าแรก",
            disabled: false,
            href: "/",
          },
          {
            text: "เขต",
            disabled: false,
            href: "house-holds",
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
            text: "ชื่อเขต",
            align: "start",
            sortable: false,
            value: "1",
          },
          { text: "แก้ไข", value: "actions", sortable: false },
        ],
        modalActive: false,
        isEdit: false,
      };
    },
    methods: {
      save() {
        this.modalActive = false;
        this.isEdit = false;
      },
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
  .v-input__control {
    padding: 0px;
  }
  </style>
  