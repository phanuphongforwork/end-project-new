<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>
    <v-card class="pb-4 mt-6">
      <v-data-table
        :headers="headers"
        :items="desserts"
        hide-default-footer
        disable-filtering
        disable-sort
        :itemsPerPage="5"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <a href="#">กดเพื่อเพิ่ม</a>
        </template>
      </v-data-table>
      <!-- <hr /> -->
      <div class="px-4 py-4">
        <v-pagination
          class="mt-4"
          v-model="page"
          :length="desserts.length / 10"
          total-visible="7"
        ></v-pagination>
      </div>
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
