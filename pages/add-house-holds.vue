<template>
    <div>
      <div>
        <Breadcrumb :items="breadcrumbs" :title="title" />
      </div>
      
      <template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="12" lg="3">
          <v-text-field label="บ้านเลขที่" outlined></v-text-field>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-select :items="[]" label="ชุมชน" outlined></v-select>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-select :items="[]" label="ซอย" outlined> </v-select>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-select :items="[]" label="ถนน" outlined> </v-select>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0">
          <v-select :items="[]" label="แขวง" outlined> </v-select>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-select :items="[]" label="เขต" outlined> </v-select>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-text-field label="รหัสไปรษณีย์" outlined></v-text-field>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-text-field label="โทรศัพท์" outlined></v-text-field>
        </v-col>
      </v-row>

      <div class="mt-4">
        <NuxtLink to="/house-holds">
        <v-btn color="primary" class="col-12 col-lg-2" large>
          <v-icon left> mdi-content-save </v-icon>
          บันทึกข้อมูล
        </v-btn>
        </NuxtLink>

        <v-btn
          class="col-12 col-lg-2 ml-0 ml-lg-2 mt-4 mt-lg-0"
          large
          @click="clear()"
        >
          <v-icon left> mdi-refresh </v-icon>
          ล้างข้อมูล
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

    </div>
  </template>
  
  <script>
  import CreateHouseHold from "@/components/house-holds/CreateHouseHold";
  import Breadcrumb from "@/components/Breadcrumbs";
  export default {
    components: {
      Breadcrumb,
      CreateHouseHold,
    },
  
    data() {
      return {
        title: "ทะเบียนครัวเรือน",
        breadcrumbs: [
          {
            text: "หน้าแรก",
            disabled: false,
            href: "/",
          },
          {
            text: "ทะเบียนครัวเรือน",
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
            text: "บ้านเลขที่",
            align: "start",
            sortable: false,
            value: "1",
          },
          { text: "ชุมชน", value: "2" },
          { text: "ซอย", value: "3" },
          { text: "ถนน", value: "4" },
          { text: "แขวง", value: "5" },
          { text: "เขต", value: "6" },
          { text: "รหัสไปรษณีย์", value: "7" },
          { text: "เพิ่มบุคคล", value: "actions", sortable: false },
        ],
        desserts: Array(2)
          .fill({
            1: "110/09",
            2: "หนองแขม",
            3: "20/13",
            4: "เพชรเกษม",
            5: "หนองค้างพลู",
            6: "หนองแขม",
            7: "10320",
          })
          .map((e, index) => {
            return {
              ...e,
              index: Number(index) + 1,
            };
          }),
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
  