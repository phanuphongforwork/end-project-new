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
        @click="showCreatePerson = true"
      >
        <v-icon left> mdi-plus-circle </v-icon>
        เพิ่มสมาชิกชุมชน
      </v-btn>
      <v-btn
        color="primary"
        large
        outlined
        class="col-12 col-lg-2 mt-6"
        @click="handleExportOld()"
      >
        <v-icon left> mdi-file-download-outline </v-icon>
        ออกรายงานผู้สูงอายุ
      </v-btn>
    </div>

    <v-card outlined class="mt-4" style="padding: 8px">
      <v-row>
        <v-col cols="12" md="4">
          <v-card flat color="transparent">
            <v-subheader>เลือกช่วงอายุ (ปี)</v-subheader>

            <v-card-text>
              <v-row>
                <v-col class="px-4">
                  <v-range-slider
                    v-model="range"
                    :max="max"
                    :min="min"
                    hide-details
                    class="align-center"
                    @change="handleChangeRange()"
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        :value="range[0]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @change="$set(range, 0, $event)"
                      ></v-text-field>
                    </template>
                    <template v-slot:append>
                      <v-text-field
                        :value="range[1]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @change="$set(range, 1, $event)"
                      ></v-text-field>
                    </template>
                  </v-range-slider>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

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
        <template v-slot:item.prefix="{ item }">
          {{ prefixText[item?.prefix] || "-" }}
        </template>

        <template v-slot:item.date_of_birth="{ item }">
          {{ dayjs(item.date_of_birth).add(543, "year").format("DD/MM/YYYY") }}
        </template>

        <template v-slot:item.age="{ item }">
          {{ getAge(item.date_of_birth) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <a @click="showDetail(item)" href="#">ดูข้อมูลเพิ่มเติม</a>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="showCreatePerson"
      :fullscreen="true"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeCreatePerson()()"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeCreatePerson()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>เพิ่มสมาชิกชุมชน</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <CreateAccount @success="closeCreatePerson()" />
        </div>
      </v-card>
    </v-dialog>

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
                  <div>คำนำหน้า :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ prefixText[detail?.prefix] || "-" }}
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
                  <div>อายุ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ getAge(detail?.date_of_birth) || "-" }} ปี
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
              outlined
            >
              <v-icon left> mdi-progress-clock </v-icon>
              ปิดหน้าต่าง
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <div id="printMe" style="display: none; padding: 8px">
      <center>
        <h1>รายชื่อผู้สูงอายุประจำปี {{ new Date().getFullYear() + 543 }}</h1>
      </center>
      <table
        style="
          border: 0.5px solid #ddd;
          border-collapse: separate;
          border-spacing: 0px;
          width: 100%;
          margin-top: 20px;
        "
      >
        <thead
          style="
            border: 0.5px solid #ddd;
            border-collapse: separate;
            border-spacing: 0px;
          "
        >
          <tr>
            <th
              style="
                border: 0.5px solid #ddd;
                border-collapse: separate;
                border-spacing: 0px;
              "
              rowspan="2"
            >
              ลำดับที่
            </th>
            <th
              style="
                border: 0.5px solid #ddd;
                border-collapse: separate;
                border-spacing: 0px;
              "
              rowspan="2"
            >
              ชื่อ-นามสกุล
            </th>
            <th
              style="
                border: 0.5px solid #ddd;
                border-collapse: separate;
                border-spacing: 0px;
              "
              rowspan="2"
            >
              อายุ
            </th>
            <th
              colspan="2"
              style="
                border: 0.5px solid #ddd;
                border-collapse: separate;
                border-spacing: 0px;
              "
            >
              ประเภท
            </th>
            <th
              rowspan="2"
              style="
                border: 0.5px solid #ddd;
                border-collapse: separate;
                border-spacing: 0px;
              "
            >
              ที่อยู่/บ้านเลขที่
            </th>
          </tr>
          <tr>
            <th
              style="
                border: 0.5px solid #ddd;
                border-collapse: separate;
                border-spacing: 0px;
              "
            >
              ผู้สูงอายุ
            </th>
            <th
              style="
                border: 0.5px solid #ddd;
                border-collapse: separate;
                border-spacing: 0px;
              "
            >
              สมทบ
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="dataExport"
            v-for="(data, index) in dataExport"
            :key="index"
          >
            <th scope="row" style="border-bottom: 0.5px solid #ddd">
              {{ index + 1 }}
            </th>
            <td
              style="
                border-bottom: 0.5px solid #ddd;
                border-right: 0.5px solid #ddd;
                border-left: 0.5px solid #ddd;
              "
            >
              {{ data?.person_name || "-" }}
            </td>
            <td
              style="
                text-align: center;
                border-bottom: 0.5px solid #ddd;
                border-right: 0.5px solid #ddd;
                border-left: 0.5px solid #ddd;
              "
            >
              {{ getAge(data?.date_of_birth) || "-" }}
            </td>
            <td
              style="
                text-align: center;
                border-bottom: 0.5px solid #ddd;
                border-right: 0.5px solid #ddd;
                border-left: 0.5px solid #ddd;
              "
            >
              {{ '&#x2714' }}
            </td>
            <td
              style="
                text-align: center;
                border-bottom: 0.5px solid #ddd;
                border-right: 0.5px solid #ddd;
                border-left: 0.5px solid #ddd;
              "
            >
              {{ "" }}
            </td>
            <td
              style="
                text-align: center;
                border-bottom: 0.5px solid #ddd;
                border-bottom: 0.5px solid #ddd;
                border-right: 0.5px solid #ddd;
                border-left: 0.5px solid #ddd;
              "
            >
              {{ data?.household_member?.household?.house_number || "-" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumbs";
import Person from "../services/apis/Person";
import Role from "../components/persons/Role";
import CreateAccount from "@/components/accounts/CreateAccount";

require("dayjs/locale/th");
dayjs.locale("th");

import { NEWBORN_TEXT } from "../constants/newborn";
import { PREGNANT_TEXT } from "../constants/pregnant";
import { PREFIX_TEXT } from "../constants/prefix";

export default {
  components: {
    Breadcrumb,
    Role,
    CreateAccount,
  },
  data() {
    return {
      prefixText: PREFIX_TEXT,
      newbornText: NEWBORN_TEXT,
      pregnantText: PREGNANT_TEXT,
      modalActive: false,
      title: "สมาชิกชุมชน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "สมาชิกชุมชน",
          disabled: false,
          href: "persons",
        },
      ],
      min: 0,
      max: 100,
      range: [0, 60],
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
          text: "คำนำหน้า",
          align: "start",
          sortable: false,
          value: "prefix",
        },
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
          text: "อายุ (ปี)",
          align: "center",
          sortable: false,
          value: "age",
        },
        {
          text: "เบอร์โทรศัพท์",
          align: "start",
          sortable: false,
          value: "phone",
        },

        { text: "ดูข้อมูลเพิ่มเติม", value: "actions", sortable: false },
      ],
      items: [],
      defaultItems: [],
      showDetailData: false,
      detail: null,
      showCreatePerson: false,
      dataExport: null,
      isLoadingExport: false,
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
        this.defaultItems = data;
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
    getAge(dob) {
      return dayjs().diff(dob, "year");
    },
    closeCreatePerson() {
      this.showCreatePerson = false;
      this.loadData();
    },
    handleChangeRange() {
      this.items = this.defaultItems.filter((item) => {
        const age = this.getAge(item?.date_of_birth)
          ? Number(this.getAge(item.date_of_birth))
          : 0;
        return age >= this.range[0] && age <= this.range[1];
      });
    },
    handleFilterAgeOld() {
      return this.defaultItems.filter((item) => {
        const age = this.getAge(item?.date_of_birth)
          ? Number(this.getAge(item.date_of_birth))
          : 0;

        return age >= 60;
      });
    },
    async handleExportOld() {
      this.isLoadingExport = true;
      this.dataExport = this.handleFilterAgeOld() || [];
      this.isLoadingExport = false;

      await setTimeout(() => {
        this.$htmlToPaper("printMe", {
          styles: [],
        });
      }, 2000);
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
