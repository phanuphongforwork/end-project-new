<template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="12" lg="3">
          <v-text-field label="ชื่อจริง - นามสกุล" outlined></v-text-field>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-text-field label="บัตรประชาชน" outlined></v-text-field>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-text-field label="วัน/เดือน/ปีเกิด" outlined></v-text-field>
        </v-col>
        <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
          <v-text-field label="เบอร์โทรศัพท์" outlined></v-text-field>
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
import AlleyForm from "@/components/house-holds/alley/AlleyForm";
export default {
  components: {
    AlleyForm,
  },
  data() {
    return {
      addAlley: false,
    };
  },
  methods: {
    submit() {
      this.$emit("save");
    },
    clear() {},
  },
};
</script>

<style></style>
