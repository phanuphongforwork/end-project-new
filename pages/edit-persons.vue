<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>

    <v-card class="mt-6" outlined>
      <v-card-title class="col-12">
        <div class="col-12">
          <v-text-field
            v-model="search"
            class="col-12"
            append-icon="mdi-magnify"
            label="ค้นหาด้วยบัตรประชาชน หรือ ชื่อ-นามสกุล"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </div>
      </v-card-title>

      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="items"
        disable-filtering
        disable-sort
        :page="meta.page"
        :itemsPerPage="meta.perPage || 5"
        :server-items-length="meta.total"
        class="elevation-1"
        @update:items-per-page="changePerPage"
        @update:page="changePage"
        no-results-text="ไม่พบข้อมูล"
        no-data-text="ไม่พบข้อมูล, ลองค้นหาใหม่อีกครั้ง"
      >
        <template v-slot:item.date_of_birth="{ item }">
          {{ dayjs(item.date_of_birth).add(543, "year").format("DD/MM/YYYY") }}
        </template>

        <template v-slot:item.role="{ item }">
          <Role :role="item.role" />
        </template>

        <template v-slot:[`item.actions`]>
          <a href="#">แก้ไขสมาชิกครัวเรือน</a>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumbs";
import Person from "../services/apis/Person";
import Role from "../components/persons/Role";

require("dayjs/locale/th");
dayjs.locale("th");

export default {
  components: {
    Breadcrumb,
    Role,
  },
  data() {
    return {
      modalActive: false,
      title: "แก้ไขสมาชิกครัวเรือน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "แก้ไขสมาชิกครัวเรือน",
          disabled: false,
          href: "edit-persons",
        },
      ],
      search: "",
      meta: {},
      param: {
        page: 1,
        perPage: 5,
        q: "",
        sort: "created_at",
        order: "desc",
        includes: "",
      },
      loading: false,
      headers: [
        {
          text: "ชื่อ - นามสกุล",
          align: "start",
          sortable: false,
          value: "person_name",
        },
        {
          text: "บัตรประชาชน",
          align: "start",
          sortable: false,
          value: "id_card",
        },
        {
          text: "บัญชีเข้าสู่ระบบ",
          align: "start",
          sortable: false,
          value: "id_card",
        },
        {
          text: "วัน/เดือน/ปีเกิด",
          align: "start",
          sortable: false,
          value: "date_of_birth",
        },
        {
          text: "เบอร์โทรศัพท์",
          align: "start",
          sortable: false,
          value: "phone",
        },
        {
          text: "บทบาท",
          align: "center",
          sortable: false,
          value: "role",
        },
        { text: "แก้ไขสมาชิกครัวเรือน", value: "actions", sortable: false },
      ],
      items: [],
    };
  },
  watch: {
    search: {
      handler(data) {
        if (data) {
          this.loadData();
        } else {
          this.search = undefined;
          this.loadData();
        }
      },
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    dayjs,
    async loadData() {
      try {
        this.loading = true;
        const { data, meta } = await Person.getAll({
          ...this.param,
          q: this.search ?? undefined,
        });
        this.items = data;
        this.meta = meta;

        this.loading = false;
      } catch {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      } finally {
        this.loading = false;
      }
    },
    updateParam(paramName, value) {
      this.param = {
        ...this.param,
        [paramName]: value,
      };

      if (this.pushState) {
        this.$router.push({
          query: this.param,
          path: this.$route.path,
        });
      }
    },
    removeParam(paramName) {
      delete this.param[paramName];
    },
    changePage(page) {
      this.updateParam("page", page);
      this.loadData();
    },
    changeSearch(keyword) {
      this.updateParam("q", keyword);
      this.updateParam("page", 1);
      this.loadData();
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    changePerPage(perPage) {
      this.updateParam("perPage", perPage);
      this.updateParam("page", 1);
      this.loadData();
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
</style>
