<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>
    <div>
      <v-btn color="primary" large class="col-12 col-lg-2 mt-6">
        <v-icon left> mdi-plus-circle </v-icon>
        เพิ่มสมาชิกครัวเรือน
      </v-btn>
    </div>
    <v-card class="mt-6" outlined>
      <v-data-table
        :headers="headers"
        :items="persons"
        disable-filtering
        disable-sort
        :itemsPerPage="5"
        class="elevation-1"
      >
        <template
          v-slot:[`item.Status`]="{ item }"
          class="d-flex justify-center"
        >
          <v-chip color="primary" dark>
            {{ item.Status }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumbs";
import CreatePersons from "@/components/persons/CreatePersons";

export default {
  components: {
    Breadcrumb,
    CreatePersons,
  },
  data() {
    return {
      modalActive: false,
      title: "สมาชิกครัวเรือน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "สมาชิกครัวเรือน",
          disabled: false,
          href: "persons",
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
          text: "ชื่อ - นามสกุล",
          align: "start",
          sortable: false,
          value: "PersonName",
        },
        {
          text: "บัตรประชาชน",
          align: "start",
          sortable: false,
          value: "IDcard",
        },
        {
          text: "วันเดือนปีเกิด",
          align: "start",
          sortable: false,
          value: "DateOfBirth",
        },
        {
          text: "เบอร์โทรศัพท์",
          align: "start",
          sortable: false,
          value: "Phone",
        },
        { text: "แก้ไข", value: "actions", sortable: false },
      ],
    };
  },
  methods: {},
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
