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
        :headers="headers"
        :items="houseHolds"
        disable-filtering
        disable-sort
        :itemsPerPage="5"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <a @click="handleEditData(item)" href="#">แก้ไขทะเบียนครัวเรือน</a>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="showEditData"
      :fullscreen="true"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeEditModal()"
    >
      <v-card v-if="editData">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeEditModal()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >แก้ไขทะเบียนครัวเรือน บ้านเลขที่
            {{ editData && editData.house_number }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <v-container fluid class="mt-4">
            <v-row>
              <v-col cols="12" md="3" lg="4">
                <v-text-field
                  v-model="editData.house_number"
                  label="บ้านเลขที่"
                  name="house_number"
                  data-vv-as="บ้านเลขที่"
                  v-validate="'required'"
                  :disabled="true"
                  :error-messages="errors && errors.first('house_number')"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" lg="4">
                <v-select
                  v-model="editData.comm_id"
                  :items="communityOptions"
                  label="ชุมชน"
                  name="community"
                  data-vv-as="ชุมชน"
                  v-validate="'required'"
                  :disabled="true"
                  :error-messages="errors && errors.first('community')"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" md="3" lg="4">
                <v-select
                  v-model="editData.alley_id"
                  :items="alleyOptions"
                  label="ซอย"
                  name="alley"
                  data-vv-as="ซอย"
                  v-validate="'required'"
                  :disabled="true"
                  :error-messages="errors && errors.first('alley')"
                  outlined
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3" lg="4">
                <v-select
                  v-model="editData.road_id"
                  :items="roadOptions"
                  label="ถนน"
                  name="road"
                  data-vv-as="ถนน"
                  v-validate="'required'"
                  :disabled="true"
                  :error-messages="errors && errors.first('road')"
                  outlined
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3" lg="4">
                <v-select
                  v-model="editData.district_id"
                  :items="districtOptions"
                  label="เขต"
                  name="district"
                  data-vv-as="เขต"
                  v-validate="'required'"
                  :disabled="true"
                  :error-messages="errors && errors.first('district')"
                  outlined
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3" lg="4">
                <v-select
                  v-model="editData.subdistrict_id"
                  :items="subdistrictOptions"
                  label="แขวง"
                  name="subdistrict"
                  data-vv-as="แขวง"
                  v-validate="'required'"
                  :disabled="true"
                  :error-messages="errors && errors.first('subdistrict')"
                  outlined
                >
                </v-select>
              </v-col>

              <v-col cols="12" md="3" lg="4">
                <v-text-field
                  v-model="editData.subdistrict.post_code"
                  label="รหัสไปรษณีย์"
                  name="postCode"
                  data-vv-as="รหัสไปรษณีย์"
                  v-validate="'required'"
                  :disabled="true"
                  :error-messages="errors && errors.first('postCode')"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3" lg="4">
                <v-text-field
                  label="เบอร์โทรศัพท์"
                  name="phone"
                  v-model="editData.phone"
                  data-vv-as="เบอร์โทรศัพท์"
                  v-validate="'required|numeric'"
                  :disabled="!isAdmin"
                  :error-messages="errors && errors.first('phone')"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>

            <div v-if="isAdmin" class="mt-4">
              <v-btn
                color="primary"
                class="col-12 col-lg-2"
                large
                :loading="loading"
                @click="submit()"
              >
                <v-icon left> mdi-content-save </v-icon>
                แก้ไขข้อมูลทะเบียนครัวเรือน
              </v-btn>
            </div>
          </v-container>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showResult"
      :fullscreen="false"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeResultModal()"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>รายละเอียดทะเบียนครัวเรือน</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <v-alert type="success" outlined>
            สร้างทะเบียนครัวเรือน บ้านเลขที่ {{ house_number }} สำเร็จ!
          </v-alert>

          <div class="mt-4">
            <v-card outlined>
              <v-card-title>รายละเอียด</v-card-title>

              <div class="px-4">
                <div class="d-flex">
                  <div>บ้านเลขที่ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.house_number || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>เขต :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.district?.district_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>แขวง :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.subdistrict?.subdistrict_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>ถนน :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.road?.road_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>ซอย :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.alley?.alley_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>รหัสไปรษณีย์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.subdistrict?.post_code || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>เบอร์โทรศัพท์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.phone || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>หัวหน้าครัวเรือน :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.person?.person_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2 mb-4">
                  <div>อาสาสมัคร :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.volunteer?.person_name || "-" }}
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
import Breadcrumb from "@/components/Breadcrumbs";
import HouseHold from "../services/apis/HouseHold";
import Community from "../services/apis/Community";
import Alley from "../services/apis/Alley";
import Road from "../services/apis/Road";
import District from "../services/apis/District";
import SubDistrict from "../services/apis/SubDistrict";

export default {
  components: {
    Breadcrumb,
  },

  data() {
    return {
      title: "แก้ไขทะเบียนครัวเรือน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "แก้ไขทะเบียนครัวเรือน",
          disabled: false,
          href: "edit-house-holds",
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
        { text: "แก้ไขทะเบียนครัวเรือน", value: "actions", sortable: false },
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
      showResult: false,
      editData: null,
      showEditData: false,
      communityOptions: [],
      alleyOptions: [],
      roadOptions: [],
      districtOptions: [],
      subdistrictOptions: [],
      resultData: {},
    };
  },
  computed: {
    isAdmin() {
      const level = localStorage.getItem("user_level") || null;
      return Number(level) === 1;
    },
  },
  watch: {
    house_number: {
      handler(data) {
        this.loadData();
      },
    },
  },
  mounted() {
    this.loadData();
    this.loadCommunity();
    this.loadAlley();
    this.loadRoad();
    this.loadDistrict();
    this.loadSubDistrict();
  },
  methods: {
    async loadDistrict() {
      try {
        const { data } = await District.getAll({
          page: 1,
          perPage: 1000,
        });

        this.districtOptions = data.map((value) => {
          return {
            value: value.district_id,
            text: value.district_name,
          };
        });
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      }
    },
    async loadSubDistrict() {
      try {
        const { data } = await SubDistrict.getAll({
          page: 1,
          perPage: 1000,
        });

        this.subdistrictOptions = data.map((value) => {
          return {
            value: value.subdistrict_id,
            text: value.subdistrict_name,
            postCode: value.post_code,
          };
        });
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      }
    },
    async loadRoad() {
      try {
        const { data } = await Road.getAll({
          page: 1,
          perPage: 1000,
        });

        this.roadOptions = data.map((value) => {
          return {
            value: value.road_id,
            text: value.road_name,
          };
        });
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      }
    },
    async loadAlley() {
      try {
        const { data } = await Alley.getAll({
          page: 1,
          perPage: 1000,
        });

        this.alleyOptions = data.map((value) => {
          return {
            value: value.alley_id,
            text: value.alley_name,
          };
        });
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      }
    },
    async loadCommunity() {
      try {
        const { data } = await Community.getAll({
          page: 1,
          perPage: 1000,
        });

        this.communityOptions = data.map((value) => {
          return {
            value: value.comm_id,
            text: value.comm_name,
          };
        });
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      }
    },

    async loadData() {
      try {
        const { data, meta } = await HouseHold.getAll({
          ...this.param,
          "filters[house_number]": this.house_number,
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

    closeModal() {
      this.showResult = false;
    },
    handleEditData(data) {
      this.editData = data;
      this.showEditData = true;
    },
    closeEditModal() {
      this.editData = null;
      this.showEditData = false;
    },
    getPayload() {
      return {
        comm_id: this.editData.comm_id,
        alley_id: this.editData.alley_id,
        road_id: this.editData.road_id,
        subdistrict_id: this.editData.subdistrict_id,
        district_id: this.editData.district_id,
        house_number: this.editData.house_number,
        phone: this.editData.phone,
      };
    },

    async submit() {
      const validate = await this.$validator.validateAll();
      if (!validate) return;

      try {
        const payload = this.getPayload();

        this.loading = true;
        const { data } = await HouseHold.update(
          this.editData && this.editData.house_id,
          payload
        );
        this.resultData = data;
        this.loading = false;

        this.showResult = true;
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      } finally {
        this.loading = false;
      }
    },

    closeResultModal() {
      this.showResult = false;
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
