<template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <v-text-field label="ชื่อสิทธิ์การใช้งาน" outlined></v-text-field>
        </v-col>
        <v-col cols="12" class="pl-0 pl-lg-6" lg="6">
          <v-switch v-model="status" inset label="เปิดใช้งาน"></v-switch>
        </v-col>
      </v-row>

      <div class="mt-4">
        <v-btn color="primary" class="col-12 col-lg-2" large>
          <v-icon left> mdi-content-save </v-icon>
          บันทึกข้อมูล
        </v-btn>

        <v-btn class="col-12 col-lg-2 ml-0 ml-lg-2 mt-4 mt-lg-0" large>
          <v-icon left> mdi-refresh </v-icon>
          ล้างข้อมูล
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: true,
    };
  },
};
</script>

<style></style>
