<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
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
        <template v-slot:item.volunteer.person_name="{ item }">
          {{ item?.volunteer?.person_name || "-" }}
        </template>

        <template v-slot:item.actions="{ item }">
          <a @click="showAddHead(item)" href="#">เพิ่มอาสาสมัคร</a>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="showEditData"
      :fullscreen="true"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeModal()"
    >
      <v-card v-if="editData">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeModal()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >เพิ่มหัวหน้าครัวเรือน บ้านเลขที่
            {{ editData.house_number }}</v-toolbar-title
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
                    {{ editData?.house_number || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>เขต :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.district?.district_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>แขวง :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.subdistrict?.subdistrict_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>ถนน :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.road?.road_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>ซอย :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.alley?.alley_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>รหัสไปรษณีย์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.subdistrict?.post_code || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>เบอร์โทรศัพท์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.phone || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>หัวหน้าครัวเรือน :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.person?.person_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2 mb-4">
                  <div>อาสาสมัคร :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.volunteer?.person_name || "-" }}
                  </div>
                </div>
              </div>
            </v-card>

            <v-card outlined class="mt-4">
              <v-card-title>เลือกอาสาสมัคร</v-card-title>
              <div class="px-4">
                <div>
                  <v-card-title class="col-12">
                    <div class="col-12">
                      <v-text-field
                        v-model="search"
                        class="col-12"
                        append-icon="mdi-magnify"
                        label="ค้นหาบัตรประชาชน"
                        single-line
                        hide-details
                        outlined
                      ></v-text-field>
                    </div>
                  </v-card-title>
                  <v-simple-table fixed-header height="300px">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">ชื่อ-นามสกุล</th>
                          <th class="text-left">บัตรประชาชน</th>

                          <th class="text-left">ตั้งเป็นอาสา</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in volunteerOptions" :key="item">
                          <td>{{ item?.person_name || "-" }}</td>
                          <td>{{ item?.id_card || "-" }}</td>

                          <td>
                            <v-btn
                              v-if="
                                editData &&
                                editData.volunteer_id !== item.person_id
                              "
                              @click="submit(item.person_id)"
                              color="primary"
                            >
                              <v-icon left> mdi-account </v-icon>
                              ตั้งเป็นอาสา
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
              </div>
            </v-card>
            <v-btn
              color="primary"
              outlined
              class="col-12 mt-4"
              large
              @click="closeModal()"
            >
              <!-- <v-icon left> mdi-account </v-icon> -->
              ปิดหน้าต่าง
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
import HouseHold from "../services/apis/HouseHold";
import Person from "../services/apis/Person";

require("dayjs/locale/th");
dayjs.locale("th");
export default {
  components: {
    Breadcrumb,
  },

  data() {
    return {
      loading: false,
      title: "เพิ่มอาสาสมัคร",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "เพิ่มอาสาสมัคร",
          disabled: false,
          href: "add-volunteer-house-holds",
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
        { text: "อาสาสมัคร", value: "volunteer.person_name" },
        { text: "เพิ่มอาสาสมัคร", value: "actions", sortable: false },
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
      showEditData: false,
      editData: null,
      volunteerOptions: [],
      volunteer: null,
      search: undefined,
    };
  },
  watch: {
    search: {
      handler(data) {
        if (data) {
          this.loadPerson();
        } else {
          this.search = undefined;
          this.loadPerson();
        }
      },
    },
  },
  mounted() {
    this.loadPerson();
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
    async loadPerson() {
      try {
        const { data: persons } = await Person.getAll({
          perPage: 1000,
          isVolunteer: 1,
          "filters[id_card]": this.search ?? undefined,
        });

        this.volunteerOptions = persons;
      } catch {}
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
    showAddHead(house) {
      this.editData = house;
      this.showEditData = true;
    },
    closeModal() {
      this.editData = null;
      this.showEditData = false;
      this.volunteer = null;
    },
    async submit(person_id) {
      const validate = await this.$validator.validateAll();
      if (!validate) return;

      try {
        const { data } = await HouseHold.update(this.editData.house_id, {
          volunteer_id: person_id,
        });

        this.$toast.success("เพิ่มอาสาสมัคร สำเร็จ!");

        this.closeModal();
        this.loadData();
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      } finally {
        this.loading = false;
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
