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
        เพิ่มทะเบียนครัวเรือน
      </v-btn>
    </div>
    <v-card class="mt-6" outlined>
      <v-card-title class="col-12">
        <div class="col-12">
          <v-text-field
            class="col-12"
            append-icon="mdi-magnify"
            label="ค้นหาโดย บ้านเลขที่, รหัสไปรษณีย์"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </div>

        <div class="col-12">
          <v-row no-gutters>
            <v-col lg="3" md="3" cols="12">
              <v-select :items="[]" label="เขต" outlined></v-select>
            </v-col>
            <v-col lg="3" md="3" cols="12" class="pl-0 pl-md-2">
              <v-select :items="[]" label="แขวง" outlined></v-select>
            </v-col>
            <v-col lg="3" md="3" cols="12" class="pl-0 pl-md-2">
              <v-select :items="[]" label="ชุมชน" outlined></v-select>
            </v-col>
            <v-col lg="3" md="3" cols="12" class="pl-0 pl-md-2">
              <v-select :items="[]" label="ถนน" outlined></v-select>
            </v-col>
          </v-row>
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
        <template v-slot:[`item.actions`]="{ item }">
          <a href="#">กดเพื่อเพิ่ม</a>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="modalActive"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>สร้างทะเบียนครัวเรือน</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- <v-toolbar-items>
            <div class="pt-1 pt-md-3">
              <v-btn outlined color="white" large> บันทึกข้อมูล </v-btn>
            </div>
          </v-toolbar-items> -->
        </v-toolbar>
        <CreateHouseHold />
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
      desserts: Array(30)
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
.v-input__control {
  padding: 0px;
}
</style>
