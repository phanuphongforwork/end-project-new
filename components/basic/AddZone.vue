<template>
    <div>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12" lg="12">
            <v-text-field label="ชื่อเขต" outlined></v-text-field>
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
  export default {
    methods: {
      submit() {
        this.$emit("save");
      },
      clear() {},
    },
  };
  </script>
  
  <style></style>
  