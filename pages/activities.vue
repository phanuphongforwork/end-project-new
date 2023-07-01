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
        @click="showCreate = true"
      >
        <v-icon left> mdi-plus-circle </v-icon>
        สร้างกิจกรรม
      </v-btn>
    </div>

    <v-card class="mt-6" outlined>
      <v-card-title class="col-12">
        <div class="col-12 col-md-9">
          <v-text-field
            v-model="name"
            class="col-12"
            append-icon="mdi-magnify"
            label="ค้นหาชื่อกิจกรรม"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </div>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="activities"
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
        <template v-slot:item.activity_date="{ item }">
          {{
            dayjs(item?.activity_date)
              .add(543, "year")
              .format("DD MMMM YYYY") || "-"
          }}
        </template>
        <template v-slot:item.activity_end_date="{ item }">
          {{
            item?.activity_end_date
              ? dayjs(item?.activity_end_date)
                  .add(543, "year")
                  .format("DD MMMM YYYY")
              : "-"
          }}
        </template>

        <template v-slot:item.preview="{ item }">
          <a @click="showPreview(item)" href="#">แสดงรายละเอียด</a>
        </template>
        <template v-slot:item.export="{ item }">
          <a @click="handleExport(item)" href="#">ออกรายงาน</a>
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
          <v-toolbar-title> {{ previewData.activity_name }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <div class="mt-4">
            <v-card outlined>
              <v-card-title>รายละเอียด</v-card-title>

              <div class="px-4">
                <div class="d-flex">
                  <div>ชื่อกิจกรรม :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.activity_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>รายละเอียดกิจกรรม :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.activity_description || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>วันที่จัดกิจกรรม :</div>
                  <div class="pl-4 font-weight-bold">
                    {{
                      dayjs(previewData?.activity_date)
                        .add(543, "year")
                        .format("DD MMMM YYYY") || "-"
                    }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>วันที่สิ้นสุดกิจกรรม :</div>
                  <div class="pl-4 font-weight-bold">
                    {{
                      dayjs(previewData?.activity_end_date)
                        .add(543, "year")
                        .format("DD MMMM YYYY") || "-"
                    }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>หน่วยงานที่จัด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.agency_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>สถานที่จัด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.location_name || "-" }}
                  </div>
                </div>
              </div>
            </v-card>

            <v-card outlined class="mt-4">
              <v-card-title class="d-flex">
                <div class="mt-4">
                  สมาชิก ({{ previewData?.users?.length || 0 }}) คน
                </div>
              </v-card-title>

              <div class="px-4">
                <div>
                  <div
                    class="d-flex mb-8 mt-4"
                    v-if="
                      previewData?.users && previewData?.users?.length === 0
                    "
                  >
                    ไม่มีสมาชิกเข้าร่วมกิจกรรม
                  </div>

                  <v-simple-table
                    v-if="previewData?.users && previewData?.users?.length > 0"
                    fixed-header
                    height="300px"
                  >
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">ชื่อ-นามสกุล</th>
                          <!-- <th class="text-left">บัตรประชาชน</th> -->
                          <th class="text-left">วัน/เดือน/ปีเกิด</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in previewData?.users" :key="item">
                          <td>{{ item?.person?.person_name || "-" }}</td>
                          <!-- <td>{{ item?.person?.id_card || "-" }}</td> -->
                          <td>
                            {{
                              dayjs(item?.person?.date_of_birth)
                                .add(543, "year")
                                .format("DD MMMM YYYY") || "-"
                            }}
                          </td>
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

    <v-dialog
      v-model="showCreate"
      :fullscreen="false"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeCreate()"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeCreate()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>เพิ่มกิจกรรมชุมชน</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <v-container fluid class="mt-4">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="activityName"
                  label="ชื่อกิจกรรม"
                  name="activityName"
                  data-vv-as="ชื่อกิจกรรม"
                  v-validate="'required'"
                  :error-messages="errors && errors.first('activityName')"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="activityDesc"
                  label="รายละเอียดกิจกรรม"
                  name="activityDesc"
                  data-vv-as="รายละเอียดกิจกรรม"
                  v-validate="''"
                  :error-messages="errors && errors.first('activityDesc')"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="agencyName"
                  label="หน่วยงานที่จัด"
                  name="agencyName"
                  data-vv-as="หน่วยงานที่จัด"
                  v-validate="'required'"
                  :error-messages="errors && errors.first('agencyName')"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="locationName"
                  label="สถานที่จัด"
                  name="locationName"
                  data-vv-as="สถานที่จัด"
                  v-validate="'required'"
                  :error-messages="errors && errors.first('locationName')"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-menu
                  v-model="datepick"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="computedDateFormatted"
                      clearable
                      label="วันที่จัดกิจกรรม"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @click:clear="activityDate = null"
                      :error-messages="errors && errors.first('activityDate')"
                      outlined
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="activityDate"
                    @change="datepick = false"
                    name="activityDate"
                    data-vv-as="วันที่จัดกิจกรรม"
                    v-validate="'required'"
                    locale="th-TH"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-menu
                  v-model="datepick2"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="computedEndDateFormatted"
                      clearable
                      label="วันที่สิ้นสุดกิจกรรม"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @click:clear="activityEndDate = null"
                      :error-messages="
                        errors && errors.first('activityEndDate')
                      "
                      outlined
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="activityEndDate"
                    @change="datepick2 = false"
                    name="activityEndDate"
                    data-vv-as="วันที่สิ้นสุดกิจกรรม"
                    v-validate="'required'"
                    locale="th-TH"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <div class="mt-4">
              <v-btn
                color="primary"
                class="col-12 col-lg-2"
                large
                @click="submit()"
              >
                <v-icon left> mdi-content-save </v-icon>
                บันทึกข้อมูล
              </v-btn>

              <v-btn
                class="col-12 col-lg-2 ml-0 ml-lg-2 mt-4 mt-lg-0"
                large
                @click="clear()"
              >
                <v-icon left> mdi-refresh </v-icon>
                ล้างข้อมูล
              </v-btn>
            </div>
          </v-container>
        </div>
      </v-card>
    </v-dialog>

    <div id="printMe" style="display: none; padding: 8px">
      <center>
        <h1>รายงานการเข้าร่วมกิจกรรม {{ new Date().getFullYear() + 543 }}</h1>
      </center>

      <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr">
        <div style="width: 100%; display: flex">
          <div style="width: 180px">ชื่อกิจกรรม</div>
          <div style="width: 100%; border-bottom-style: dotted">
            {{ dataExport?.activity_name || "" }}
          </div>
        </div>
        <div style="width: 100%; display: flex">
          <div style="width: 180px">รายละเอียด</div>
          <div style="width: 100%; border-bottom-style: dotted">
            {{ dataExport?.activity_description || "" }}
          </div>
        </div>
      </div>

      <div
        style="
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-top: 4px;
        "
      >
        <div style="width: 100%; display: flex">
          <div style="width: 180px">หน่วยงานที่จัด</div>
          <div style="width: 100%; border-bottom-style: dotted">
            {{ dataExport?.agency_name }}
          </div>
        </div>
        <div style="width: 100%; display: flex">
          <div style="width: 180px">สถานที่จัดกิจกรรม</div>
          <div style="width: 100%; border-bottom-style: dotted">
            {{ dataExport?.location_name }}
          </div>
        </div>
      </div>

      <div
        style="
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-top: 4px;
        "
      >
        <div style="width: 100%; display: flex">
          <div style="width: 180px">วันที่เริ่มต้น</div>
          <div style="width: 100%; border-bottom-style: dotted">
            {{ dayjs(dataExport?.activity_date).format("DD/MMMM/YYYY") }}
          </div>
        </div>
        <div style="width: 100%; display: flex">
          <div style="width: 180px">วันที่สิ้นสุด</div>
          <div style="width: 100%; border-bottom-style: dotted">
            {{
              dataExport?.activity_end_date
                ? dayjs(dataExport?.activity_end_date).format("DD/MMMM/YYYY")
                : ""
            }}
          </div>
        </div>
      </div>

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
            >
              ลำดับที่
            </th>
            <th
              style="
                border: 0.5px solid #ddd;
                border-collapse: separate;
                border-spacing: 0px;
              "
            >
              ชื่อ-นามสกุล
            </th>
            <th
              style="
                border: 0.5px solid #ddd;
                border-collapse: separate;
                border-spacing: 0px;
              "
            >
              อายุ
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="dataExport?.users"
            v-for="(data, index) in dataExport?.users"
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
              {{ data?.person?.person_name || "-" }}
            </td>
            <td
              style="
                text-align: center;
                border-bottom: 0.5px solid #ddd;
                border-right: 0.5px solid #ddd;
                border-left: 0.5px solid #ddd;
              "
            >
              {{ getAge(data?.person?.date_of_birth) || "-" }}
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
import Activity from "../services/apis/Activity";

require("dayjs/locale/th");
dayjs.locale("th");

export default {
  components: {
    Breadcrumb,
  },

  data() {
    return {
      isExport: false,
      showCreate: false,
      loading: false,
      title: "กิจกรรม",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "กิจกรรม",
          disabled: false,
          href: "/activities",
        },
      ],
      search: "",
      page: 1,
      headers: [
        {
          text: "ชื่อกิจกรรม",
          align: "start",
          sortable: false,
          value: "activity_name",
        },
        { text: "รายละเอียดกิจกรรม", value: "activity_description" },
        { text: "วันที่จัดกิจกรรม", value: "activity_date" },
        { text: "วันที่สิ้นสุดกิจกรรม", value: "activity_end_date" },
        { text: "หน่วยงานที่จัด", value: "agency_name" },
        { text: "สถานที่จัด", value: "location_name" },
        { text: "แสดงรายละเอียด", value: "preview" },
        { text: "ออกรายงาน", value: "export" },
      ],

      activities: [],
      meta: {},
      param: {
        page: 1,
        perPage: 5,
        q: "",
        sort: "created_at",
        order: "desc",
        includes: "",
      },
      name: undefined,
      isShowPreview: false,
      previewData: null,
      activityName: "",
      activityDate: "",
      activityEndDate: "",
      activityDesc: "",
      agencyName: "",
      locationName: "",
      datepick: false,
      datepick2: false,
      dataExport: null,
    };
  },
  computed: {
    isAdmin() {
      const level = localStorage.getItem("user_level") || null;
      if (Number(level) === 1) {
        return true;
      }
      return false;
    },
    computedDateFormatted() {
      return this.activityDate
        ? dayjs(this.activityDate).add(543, "year").format("DD MMMM YYYY")
        : "";
    },
    computedEndDateFormatted() {
      return this.activityEndDate
        ? dayjs(this.activityEndDate).add(543, "year").format("DD MMMM YYYY")
        : "";
    },
  },
  watch: {
    name: {
      handler(data) {
        if (data) {
          this.loadData();
        } else {
          this.name = undefined;
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
        const { data, meta } = await Activity.getAll({
          ...this.param,
          "filters[activity_name]": this.name ?? undefined,
        });
        this.activities = data;
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
    getPayload() {
      let payload = {
        activity_name: this.activityName,
        activity_date: this.activityDate,
        activity_end_date: this.activityEndDate,
        activity_description: this.activityDesc,
        agency_name: this.agencyName,
        location_name: this.locationName,
        status: "1",
      };

      return payload;
    },

    async submit() {
      const validate = await this.$validator.validateAll();
      if (!validate) return;

      try {
        const payload = this.getPayload();

        await Activity.create(payload);

        this.closeCreate();
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาตรวจสอบและลองใหม่อีกครั้ง");
      } finally {
        this.loadData();
      }
    },
    closeCreate() {
      this.showCreate = false;
      this.clear();
    },
    clear() {
      this.activityName = "";
      this.activityDesc = "";
      this.activityDate = "";
      this.activityEndDate = "";
      this.agencyName = "";
      this.locationName = "";
      this.$validator.reset();
    },
    // async handleExport() {
    //   try {
    //     await Activity.export({
    //       ...this.param,
    //       "filters[activity_name]": this.name ?? undefined,
    //     });
    //   } catch {
    //     this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
    //   }
    // },

    async handleExport(item) {
      this.dataExport = item;

      await setTimeout(() => {
        this.$htmlToPaper("printMe", {
          styles: [],
        });
      }, 2000);
    },
    getAge(dob) {
      return dayjs().diff(dob, "year");
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
