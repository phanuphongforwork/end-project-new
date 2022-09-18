<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>
    <v-card class="pb-4 mt-6">
      <v-data-table
        :headers="headers"
        :items="roles"
        hide-default-footer
        disable-filtering
        disable-sort
        :itemsPerPage="5"
        class="elevation-1"
      >
      </v-data-table>
      <!-- <hr /> -->
      <div class="px-4 py-4">
        <v-pagination
          v-if="roles.length / 10 > 1"
          class="mt-4"
          v-model="page"
          :length="roles.length / 10"
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
        { text: "สถานะ", value: "Status" },
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
