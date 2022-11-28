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
        to="/add-persons"
      >
        <v-icon left> mdi-plus-circle </v-icon>
        เพิ่มสมาชิกครัวเรือน
      </v-btn>
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

        <template v-slot:item.actions="{ item }">
          <a @click="showDetail(item)" href="#">ดูข้อมูลเพิ่มเติม</a>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="showDetailData"
      :fullscreen="false"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeModal()"
    >
      <v-card v-if="detail">
        <v-toolbar dark color="primary">
          <v-toolbar-title
            >รายละเอียดของ {{ detail?.person_name || "-" }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <div class="mt-4">
            <v-card outlined>
              <v-card-title>รายละเอียด</v-card-title>

              <div class="px-4">
                <div class="d-flex">
                  <div class="mt-3">บทบาท :</div>
                  <div class="pl-4 font-weight-bold">
                    <Role :role="detail.role" />
                  </div>
                </div>
                <div class="d-flex">
                  <div>ชื่อ-นามสกุล :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ detail?.person_name || "-" }}
                  </div>
                </div>
                <div v-if="resultData?.username" class="d-flex">
                  <div>ชื่อบัญชีเข้าสู่ระบบ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ detail?.username || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>วัน/เดือน/ปีเกิด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ getDOB(detail?.date_of_birth) || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>เบอร์โทรศัพท์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ detail?.phone || "-" }}
                  </div>
                </div>

                <v-divider class="my-4"> </v-divider>

                <div class="d-flex">
                  <div>สถานะเด็กแรกเกิด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{
                      newbornText[detail?.newborn] || "ไม่ได้เป็นเด็กแรกเกิด"
                    }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>สถานะหญิงตั้งครรภ์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{
                      pregnantText[detail?.pregnant] ||
                      "ไม่ได้เป็นหญิงตั้งครรภ์"
                    }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>สถานะหญิงหลังคลอด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ getPostpartum(detail?.postpartum) || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>สถานะผู้พิการ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ getDisabled(detail?.disabled) || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>สถานะป่วยโรคเรื้อรัง :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ getChronicDisease(detail?.chronic_disease) || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>มีพฤติกรรมเสี่ยงด้านความรุนแรง :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ getViolentBehavior(detail?.violent_behavior) || "-" }}
                  </div>
                </div>
              </div>
            </v-card>
            <v-btn
              color="primary"
              class="col-12 mt-4"
              large
              @click="closeModal()"
            >
              <v-icon left> mdi-progress-clock </v-icon>
              ดำเนินการต่อ
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumbs";
import Person from "../services/apis/Person";
import Role from "../components/persons/Role";

require("dayjs/locale/th");
dayjs.locale("th");

import { NEWBORN_TEXT } from "../constants/newborn";
import { PREGNANT_TEXT } from "../constants/pregnant";

export default {
  components: {
    Breadcrumb,
    Role,
  },
  data() {
    return {
      newbornText: NEWBORN_TEXT,
      pregnantText: PREGNANT_TEXT,
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
        { text: "ดูข้อมูลเพิ่มเติม", value: "actions", sortable: false },
      ],
      items: [],
      showDetailData: false,
      detail: null,
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
    changePerPage(perPage) {
      this.updateParam("perPage", perPage);
      this.updateParam("page", 1);
      this.loadData();
    },
    showDetail(detail) {
      this.detail = detail;
      this.showDetailData = true;
    },
    closeModal() {
      this.detail = null;
      this.showDetailData = false;
    },
    getDisabled(disableStatus) {
      return disableStatus ? "เป็นผู้พิการ" : "ไม่ได้เป็นผู้พิการ";
    },
    getPostpartum(postpartum) {
      return postpartum ? "เป็นหญิงหลังคลอด" : "ไม่ได้เป็นหญิงหลังคลอด";
    },
    getChronicDisease(chronicDisease) {
      return chronicDisease
        ? "เป็นผู้ป่วยโรคเรื้อรัง"
        : "ไม่ได้เป็นผู้ป่วยโรคเรื้อรัง";
    },
    getViolentBehavior(ViolentBehavior) {
      return ViolentBehavior
        ? "มีพฤติกรรมเสี่ยงด้านความรุนแรง"
        : "ไม่ได้มีพฤติกรรมเสี่ยงด้านความรุนแรง";
    },
    getDOB(dob) {
      return dayjs(dob).add(543, "year").format("DD MMMM YYYY");
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
