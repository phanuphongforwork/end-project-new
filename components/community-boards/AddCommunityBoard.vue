<template>
  <div v-if="person">
    <div>
      <div class="d-flex">
        <div>บัตรประชาชน :</div>
        <div class="pl-4 font-weight-bold">
          {{ person?.id_card || "-" }}
        </div>
      </div>
      <div class="d-flex">
        <div>ชื่อ-นามสกุล :</div>
        <div class="pl-4 font-weight-bold">
          {{ person?.person_name || "-" }}
        </div>
      </div>
      <div class="d-flex">
        <div>ตำแหน่ง :</div>
        <div class="pl-4 font-weight-bold">
          {{ text || "-" }}
        </div>
      </div>
    </div>

    <div>
      <v-btn
        color="primary"
        large
        class="col-12 col-lg-2 mt-6 mb-6"
        @click="submit()"
      >
        <v-icon left> mdi-content-save</v-icon>
        บันทึกข้อมูล
      </v-btn>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { COMMITTEE_TEXT } from "../../constants/committee";

import CommunityBoard from "../../services/apis/CommunityBoard";
import Person from "../../services/apis/Person";
import CommiteeApi from "../../services/apis/Commitee";

require("dayjs/locale/th");
dayjs.locale("th");

export default {
  props: {
    idCard: {
      type: String,
      default: "",
    },
    comittee: {
      type: Number,
      default: "",
    },
  },
  data() {
    return {
      committeeText: COMMITTEE_TEXT,
      person: null,
      text: "",
    };
  },
  watch: {
    idCard: {
      immediate: true,
      handler(data) {
        if (data) {
          this.loadPerson();
          this.loadCommittee();
        }
      },
    },
  },
  methods: {
    async loadCommittee() {
      const data = await CommiteeApi.getById(this.comittee);
      this.text = data.committee_name;
    },
    async loadPerson() {
      const { data } = await Person.getAll({
        "filters[id_card]": this.idCard,
      });

      if (data && data.length > 0) {
        this.person = data[0];
      } else {
        this.person = null;
      }

      if (!this.person) {
        this.$toast.error(
          "ไม่พบสมาชิกชุมชน จากบัตรประชาชนดังกล่าว กรุณาลองใหม่อีกครั้ง"
        );
        this.$emit("close");
      }
    },
    async submit() {
      try {
        await CommunityBoard.create({
          person_id: this.person?.person_id,
          committee_id: this.comittee,
          status: "1",
          start_date: dayjs().startOf("year").format("YYYY-MM-DD"),
          end_date: dayjs().endOf("year").format("YYYY-MM-DD"),
        });

        this.$toast.success("สร้างคณะกรรมการสำเร็จสำเร็จ");
        this.$emit("success");
        this.clear();
      } catch {
        this.$toast.error("ผิดพลาด, คณะกรรมการที่เพิ่มอาจจะซ้ำ");
      }
    },
    clear() {
      this.person = null;
      this.text = "";
    },
  },
};
</script>

<style></style>
