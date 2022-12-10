<template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="12" lg="12" md="12">
          <v-text-field
            v-model="commiteeName"
            label="ตำแหน่ง"
            name="commitee"
            data-vv-as="ตำแหน่ง"
            v-validate="'required'"
            :error-messages="errors && errors.first('commitee')"
            outlined
          ></v-text-field>
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
import CommiteeApi from "../../services/apis/Commitee";
export default {
  data() {
    return {
      commiteeName: "",
    };
  },
  methods: {
    async submit() {
      try {
        const validate = await this.$validator.validateAll();
        if (!validate) return;

        await CommiteeApi.create({
          committee_name: this.commiteeName,
        });

        this.$toast.success("สร้างตำแหน่งสำเร็จ");
        this.$emit("success");
      } catch {
        this.$toast.error("ผิดพลาด, ตำแหน่งที่เพิ่มอาจจะซ้ำ");
      }
    },
    clear() {
      this.commiteeName = "";
      this.$validator.reset();
    },
  },
};
</script>

<style></style>
