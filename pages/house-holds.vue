<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>

    <div v-if="isAdmin">
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
        :loading="loading"
        :headers="headers"
        :items="houseHolds"
        disable-filtering
        disable-sort
        :page="meta.page"
        :itemsPerPage="meta.perPage || 5"
        :server-items-length="meta.total"
        class="elevation-1"
        @update:items-per-page="changePerPage"
        @update:page="changePage"
        no-results-text="ไม่พบข้อมูล"
        no-data-text="ไม่พบข้อมูล, ลองค้นหาทะเบียนบ้านใหม่อีกครั้ง"
      >
        <template v-slot:item.preview="{ item }">
          <a @click="showPreview(item)" href="#">แสดงรายละเอียด</a>
        </template>

        <template v-slot:item.export="{ item }">
          <a @click="exportData(item)" href="#">ออกรายงาน</a>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="isShowPreview"
      :fullscreen="true"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closePreview()"
    >
      <v-card v-if="previewData">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closePreview()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >สมาชิกครัวเรือน บ้านเลขที่
            {{ previewData.house_number }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <div class="mt-4">
            <v-card outlined>
              <v-card-title>รายละเอียด</v-card-title>

              <div class="px-4">
                <div class="d-flex">
                  <div>บ้านเลขที่ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.house_number || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>เขต :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.district?.district_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>แขวง :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.subdistrict?.subdistrict_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>ถนน :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.road?.road_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>ซอย :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.alley?.alley_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>รหัสไปรษณีย์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.subdistrict?.post_code || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>เบอร์โทรศัพท์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.phone || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>หัวหน้าครัวเรือน :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.person?.person_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2 mb-4">
                  <div>อาสาสมัคร :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.volunteer?.person_name || "-" }}
                  </div>
                </div>
              </div>
            </v-card>

            <v-card outlined class="mt-4">
              <v-card-title class="d-flex">
                <div class="mt-4">
                  สมาชิก ({{ previewData?.members?.length || 0 }}) คน
                </div>
              </v-card-title>

              <div class="px-4">
                <div>
                  <div
                    class="d-flex mb-8 mt-4"
                    v-if="
                      previewData?.members && previewData?.members?.length === 0
                    "
                  >
                    ไม่มีสมาชิกในครัวเรือน
                  </div>

                  <v-simple-table
                    v-if="
                      previewData?.members && previewData?.members?.length > 0
                    "
                    fixed-header
                    height="300px"
                  >
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">ชื่อ-นามสกุล</th>
                          <th v-if="isAdmin" class="text-left">บัตรประชาชน</th>
                          <th class="text-left">วัน/เดือน/ปีเกิด</th>
                          <th class="text-left">สถานะในครัวเรือน</th>
                          <th class="text-left">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in previewData?.members" :key="item">
                          <td>{{ item?.person?.person_name || "-" }}</td>
                          <td v-if="isAdmin">
                            {{ item?.person?.id_card || "-" }}
                          </td>
                          <td>
                            {{
                              dayjs(item?.person?.date_of_birth)
                                .add(543, "year")
                                .format("DD MMMM YYYY") || "-"
                            }}
                          </td>
                          <td>
                            {{ getMemberStatus(item?.member_status) || "-" }}
                          </td>
                          <td>{{ getStatus(item?.status) || "-" }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
              </div>
            </v-card>
            <div class="d-flex justify-center">
              <v-btn @click="closePreview()" class="col-12 mt-4" large>
                <v-icon left> mdi-close </v-icon>
                ปิดหน้านี้
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumbs";
import HouseHold from "../services/apis/HouseHold";

require("dayjs/locale/th");
dayjs.locale("th");

export default {
  components: {
    Breadcrumb,
  },

  data() {
    return {
      loading: false,
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
        { text: "แสดงรายละเอียด", value: "preview" },
        { text: "ออกรายงาน", value: "export" },
      ],

      houseHolds: [],
      meta: {},
      param: {
        page: 1,
        perPage: 5,
        q: "",
        sort: "created_at",
        order: "desc",
        includes: "community,road,alley,volunteer,person,subdistrict,district",
      },
      house_number: undefined,
      isShowPreview: false,
      previewData: null,
      memberStatusOptions: [
        {
          value: "1",
          text: "หัวหน้าครัวเรือน",
        },
        {
          value: "2",
          text: "สมาชิกครัวเรือน",
        },
      ],
      statusOptions: [
        {
          value: "0",
          text: "เสียชีวิต",
        },
        {
          value: "1",
          text: "อยู่ในครัวเรือน",
        },
        {
          value: "2",
          text: "ย้าย",
        },
      ],
    };
  },
  computed: {
    isAdmin() {
      const myLevel = localStorage.getItem("user_level") || null;
      if (Number(myLevel) === 1) {
        return true;
      }
      return false;
    },
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
    dayjs,
    async loadData() {
      try {
        this.loading = true;
        const { data, meta } = await HouseHold.getAll({
          ...this.param,
          "filters[house_number]": this.house_number ?? undefined,
        });
        this.houseHolds = data;
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
    changePerPage(perPage) {
      this.updateParam("perPage", perPage);
      this.updateParam("page", 1);
      this.loadData();
    },
    showPreview(item) {
      this.previewData = item;

      this.isShowPreview = true;
    },
    closePreview(item) {
      this.isShowPreview = false;
      this.previewData = null;
    },
    getMemberStatus(status) {
      const memberStatus = this.memberStatusOptions.find((e) => {
        return e.value === status;
      });

      if (memberStatus) {
        return memberStatus.text;
      }

      return "-";
    },
    getStatus(status) {
      const findStatus = this.statusOptions.find((e) => {
        return e.value === status;
      });

      if (findStatus) {
        return findStatus.text;
      }

      return "-";
    },
    async exportData(data) {
      const houseId = data?.house_id || null;
      try {
        await HouseHold.export(houseId);
      } catch (e) {
        console.log(e);
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      }
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
