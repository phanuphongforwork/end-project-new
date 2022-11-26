<template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="12" lg="3">
          <v-text-field
            v-model="house_number"
            label="บ้านเลขที่"
            name="house_number"
            data-vv-as="บ้านเลขที่"
            v-validate="'required'"
            :error-messages="errors.first('house_number')"
            outlined
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-select
            v-model="community"
            :items="communityOptions"
            label="ชุมชน"
            name="community"
            data-vv-as="ชุมชน"
            v-validate="'required'"
            :error-messages="errors.first('community')"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-select
            v-model="alley"
            :items="alleyOptions"
            label="ซอย"
            name="alley"
            data-vv-as="ซอย"
            v-validate="'required'"
            :error-messages="errors.first('alley')"
            outlined
          >
          </v-select>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-select
            v-model="road"
            :items="roadOptions"
            label="ถนน"
            name="road"
            data-vv-as="ถนน"
            v-validate="'required'"
            :error-messages="errors.first('road')"
            outlined
          >
          </v-select>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0">
          <v-select
            v-model="subdistrict"
            :items="subdistrictOptions"
            label="แขวง"
            name="subdistrict"
            data-vv-as="แขวง"
            v-validate="'required'"
            :error-messages="errors.first('subdistrict')"
            outlined
          >
          </v-select>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-select
            v-model="district"
            :items="districtOptions"
            label="เขต"
            name="district"
            data-vv-as="เขต"
            v-validate="'required'"
            :error-messages="errors.first('district')"
            outlined
          >
          </v-select>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          {{ postCode }}
          <v-text-field
            v-model="postCode"
            label="รหัสไปรษณีย์"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-text-field label="โทรศัพท์" outlined></v-text-field>
        </v-col>
      </v-row>

      <div class="mt-4">
        <v-btn color="primary" class="col-12 col-lg-2" large @click="submit()">
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
</template>

<script>
import Community from "../../services/apis/Community";
import Alley from "../../services/apis/Alley";
import Road from "../../services/apis/Road";
import District from "../../services/apis/District";
import SubDistrict from "../../services/apis/SubDistrict";

export default {
  components: {},
  data() {
    return {
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
    };
  },
  mounted() {
    this.loadCommunity();
    this.loadAlley();
    this.loadRoad();
    this.loadDistrict();
    this.loadSubDistrict();
  },
  computed() {
    postCode: {
      const sub = this.subdistrictOptions.filter((value) => {
        return value.value === this.subdistrict && this.subdistrict;
      });
      return sub.postCode;
    }
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

    async submit() {
      const validate = await this.$validator.validateAll();
      if (validate) {
        // this.$emit("save");
        alert("success");
      }
    },
    clear() {},
  },
};
</script>

<style></style>
