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
        สร้างบัญชีผู้ใช้งาน
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
          <a href="#" @click="modalActive = true">แก้ไขบัญชี</a>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumbs";
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      modalActive: false,
      title: "บัญชีผู้ใช้งาน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "บัญชีผู้ใช้งาน",
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
          text: "ชื่อผู้ใช้งาน",
          align: "start",
          sortable: false,
          value: "Username",
        },
        {
          text: "สิทธิ์",
          align: "center",
          sortable: false,
          value: "role",
          width: 150,
        },
        { text: "สถานะ", value: "Status", align: "center", width: 100 },
        { text: "แก้ไขบัญชี", value: "actions", sortable: false, width: 100 },
      ],
      roles: Array(10)
        .fill({
          Username: "microwave",
          role: "แอดมิน",
          Status: "ใช้งาน",
        })
        .map((e, index) => {
          return {
            ...e,
            index: Number(index) + 1,
          };
        }),
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
