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
        nuxt
        to="/add-house-holds"
      >
        <v-icon left> mdi-plus-circle </v-icon>
        สร้างทะเบียนครัวเรือน
      </v-btn>
    </div>
    <v-card class="mt-6" outlined>
      <v-card-title class="col-12">
        <div class="col-12">
          <v-text-field
            v-model="house_number"
            class="col-12"
            append-icon="mdi-magnify"
            label="ค้นหาบ้านเลขที่"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </div>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="houseHolds"
        disable-filtering
        disable-sort
        :itemsPerPage="5"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]>
          <a href="#">เพิ่มสมาชิก</a>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumbs";
import HouseHold from "../services/apis/HouseHold";
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
          text: "บ้านเลขที่",
          align: "start",
          sortable: false,
          value: "house_number",
        },
        { text: "ชุมชน", value: "community.comm_name" },
        { text: "ซอย", value: "alley.alley_name" },
        { text: "ถนน", value: "road.road_name" },
        { text: "เขต", value: "district.district_name" },
        { text: "แขวง", value: "subdistrict.subdistrict_name" },
        { text: "รหัสไปรษณีย์", value: "subdistrict.post_code" },
        { text: "เพิ่มสมาชิก", value: "actions", sortable: false },
      ],

      houseHolds: [],
      meta: {},
      param: {
        page: 1,
        perPage: 10,
        q: "",
        sort: "created_at",
        order: "desc",
        includes: "community,road,alley,volunteer,person,subdistrict,district",
      },
      house_number: undefined,
    };
  },
  watch: {
    house_number: {
      handler(data) {
        if (data) {
          this.loadData();
        } else {
          this.house_number = undefined;
          this.loadData();
        }
      },
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const { data, meta } = await HouseHold.getAll({
          ...this.param,
          "filters[house_number]": this.house_number ?? undefined,
        });
        this.houseHolds = data;
        this.meta = meta;
      } catch {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
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
    changePerPage(perPage) {
      this.updateParam("perPage", perPage);
      this.updateParam("page", 1);
      this.loadData();
    },
    changeSorter(sort, order) {
      if (sort) {
        this.updateParam("sort", sort);
        this.updateParam("order", order);
        this.updateParam("page", 1);
        this.loadData();
      }
    },

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
