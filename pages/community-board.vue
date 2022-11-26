<template>
    <div>
      <div>
        <Breadcrumb :items="breadcrumbs" :title="title" />
      </div>
  
      <v-card class="mt-6 col-12 " outlined>
        <v-card-title class="col-12 ">
          <div class="col-12  d-inline-flex p-3">
            <div class="col-4 col-md-2">
                <label for="">ตำแหน่ง :</label>
            </div>
            <v-select
                :items="items"
                class="d-flex col-6 col-md-9"
                outlined
            ></v-select> 
            <v-btn @click="modalActive = true"
                class="ml-4 mt-2 col-2 col-md-1"
                color="success"
                >
                <v-icon left
                    
                >
                    mdi-plus
                </v-icon>
                เพิ่ม
            </v-btn>
       
           
            <!-- <v-text-field
              class="col-10 "
              
              label="เลขบัตรประชน"
              single-line
              hide-details
              outlined
            ></v-text-field> -->
          </div>
          <div class="col-12 col-md-12  d-inline-flex p-3">
            <div class="col-4 col-md-2 col-lg-2">
                <label for="">สมาชิก :</label>
            </div>
            <v-text-field
              class="col-8  col-md-10 col-lg-10"
              append-icon="mdi-magnify"
              label="เลขบัตรประชน"
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
          class="elevation-1 col-12"
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
            <v-toolbar-title>เพิ่มตำแหน่ง</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <div class="px-4 py-4">
            <EditCommunity @save="save()" />
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
  import EditCommunity from "@/components/community/EditCommunity";
  import Breadcrumb from "@/components/Breadcrumbs";
  export default {
    components: {
      Breadcrumb,
      EditCommunity,
    },
  
    data() {
      return {
        title: "คณะกรรมการชุมชน",
        breadcrumbs: [
          {
            text: "หน้าแรก",
            disabled: false,
            href: "/",
          },
          {
            text: "คณะกรรมการชุมชน",
            disabled: false,
            href: "community-board",
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
            text: "ชื่อ-นามสกุล",
            align: "start",
            sortable: false,
            value: "1",
          },
          { text: "ตำแหน่ง", value: "2" },
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
  