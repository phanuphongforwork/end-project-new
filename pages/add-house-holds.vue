<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>
    <v-container fluid class="mt-4">
      <v-row>
        <v-col cols="12" md="3" lg="4">
          <v-text-field
            v-model="house_number"
            label="บ้านเลขที่"
            name="house_number"
            data-vv-as="บ้านเลขที่"
            v-validate="'required'"
            :error-messages="errors && errors.first('house_number')"
            outlined
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3" lg="4">
          <v-select
            v-model="community"
            :items="communityOptions"
            label="ชุมชน"
            name="community"
            data-vv-as="ชุมชน"
            v-validate="'required'"
            :error-messages="errors && errors.first('community')"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="12" md="3" lg="4">
          <v-select
            v-model="alley"
            :items="alleyOptions"
            label="ซอย"
            name="alley"
            data-vv-as="ซอย"
            v-validate="'required'"
            :error-messages="errors && errors.first('alley')"
            outlined
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="3" lg="4">
          <v-select
            v-model="road"
            :items="roadOptions"
            label="ถนน"
            name="road"
            data-vv-as="ถนน"
            v-validate="'required'"
            :error-messages="errors && errors.first('road')"
            outlined
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="3" lg="4">
          <v-select
            v-model="district"
            :items="districtOptions"
            label="เขต"
            name="district"
            data-vv-as="เขต"
            v-validate="'required'"
            :error-messages="errors && errors.first('district')"
            outlined
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="3" lg="4">
          <v-select
            v-model="subdistrict"
            :items="subdistrictOptions"
            label="แขวง"
            name="subdistrict"
            data-vv-as="แขวง"
            v-validate="'required'"
            :error-messages="errors && errors.first('subdistrict')"
            outlined
          >
          </v-select>
        </v-col>

        <v-col cols="12" md="3" lg="4">
          <v-text-field
            v-model="postCode"
            label="รหัสไปรษณีย์"
            name="postCode"
            data-vv-as="รหัสไปรษณีย์"
            v-validate="'required'"
            :error-messages="errors && errors.first('postCode')"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" lg="4">
          <v-text-field
            label="เบอร์โทรศัพท์"
            name="phone"
            v-model="phone"
            data-vv-as="เบอร์โทรศัพท์"
            v-validate="'required|numeric'"
            :error-messages="errors && errors.first('phone')"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>

      <div class="mt-4">
        <v-btn
          color="primary"
          class="col-12 col-lg-2"
          large
          :loading="loading"
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

    <v-dialog
      v-model="showResult"
      hide-overlay
      :fullscreen="false"
      transition="dialog-bottom-transition"
      width="800px"
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
import Community from "../services/apis/Community";
import Alley from "../services/apis/Alley";
import Road from "../services/apis/Road";
import District from "../services/apis/District";
import SubDistrict from "../services/apis/SubDistrict";
import HouseHold from "../services/apis/HouseHold";

export default {
  components: { Breadcrumb },
  data() {
    return {
      loading: false,
      showResult: false,
      title: "เพิ่มทะเบียนครัวเรือน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "เพิ่มทะเบียนครัวเรือน",
          disabled: false,
          href: "add-house-holds",
        },
      ],
      communityOptions: [],
      alleyOptions: [],
      roadOptions: [],
      districtOptions: [],
      subdistrictOptions: [],
      alley: "",
      road: "",
      house_number: "",
      community: "",
      district: "",
      subdistrict: "",
      postCode: "",
      phone: "",
      resultData: {},
    };
  },
  watch: {
    subdistrict: {
      handler(value) {
        if (value) {
          const sub = this.subdistrictOptions.find((item) => {
            return item.value === value;
          });

          this.postCode = sub.postCode ?? "";
        }
      },
    },
  },
  mounted() {
    this.loadCommunity();
    this.loadAlley();
    this.loadRoad();
    this.loadDistrict();
    this.loadSubDistrict();
  },
  computed() {},
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

    getPayload() {
      return {
        comm_id: this.community,
        alley_id: this.alley,
        road_id: this.road,
        subdistrict_id: this.subdistrict,
        district_id: this.district,
        house_number: this.house_number,
        phone: this.phone,
      };
    },

    async submit() {
      const validate = await this.$validator.validateAll();
      if (!validate) return;

      try {
        const payload = this.getPayload();

        this.loading = true;
        const { data } = await HouseHold.create(payload);
        this.resultData = data;
        this.loading = false;

        this.showResult = true;
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.alley = "";
      this.road = "";
      this.house_number = "";
      this.community = "";
      this.district = "";
      this.subdistrict = "";
      this.postCode = "";
      this.phone = "";
      this.$validator.reset();
      window.scrollTo(0, 0);
    },
    closeModal() {
      this.showResult = false;
      this.clear();
    },
  },
};
</script>

<style></style>
