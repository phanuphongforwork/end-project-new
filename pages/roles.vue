<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
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
        <template v-slot:item.Status="{ item }" class="d-flex justify-center">
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
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      title: "บทบาท",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "บทบาท",
          disabled: false,
          href: "roles",
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
          text: "ชื่อบทบาท",
          align: "start",
          sortable: false,
          value: "LevelName",
        },
        { text: "สถานะ", value: "Status", align: "center" },
      ],
      roles: Array(5)
        .fill({
          LevelName: "แอดมิน",
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
