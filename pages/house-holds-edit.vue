<
<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>

    <v-stepper v-model="e1" class="mt-2">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">
          ค้นหาทะเบียนครัวเรือน
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">
          แก้ไขทะเบียนครัวเรือน
        </v-stepper-step>

        <v-divider></v-divider>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-container fluid>
            <v-row no-gutters>
              <v-col cols="12" lg="3">
                <v-text-field label="บ้านเลขที่" outlined></v-text-field>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
                <v-select :items="[]" label="ชุมชน" outlined></v-select>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
                <v-select :items="[]" label="ซอย" outlined> </v-select>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
                <v-select :items="[]" label="ถนน" outlined> </v-select>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0">
                <v-select :items="[]" label="แขวง" outlined> </v-select>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
                <v-select :items="[]" label="เขต" outlined> </v-select>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
                <v-text-field label="รหัสไปรษณีย์" outlined></v-text-field>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
                <v-text-field label="โทรศัพท์" outlined></v-text-field>
              </v-col>
            </v-row>
          </v-container>

          <v-btn
            color="primary"
            large
            class="col-12 col-lg-2 mt-6"
            @click="e1 = 2"
          >
            <v-icon left> mdi-book-search</v-icon>
            ค้นหาทะเบียนครัวเรือน
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-container fluid>
            <v-row no-gutters>
              <v-col cols="12" lg="3">
                <v-text-field
                  label="บ้านเลขที่"
                  value="110/09"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
                <v-select :items="[]" label="ชุมชน" outlined></v-select>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
                <v-select :items="[]" label="ซอย" outlined> </v-select>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
                <v-select :items="[]" label="ถนน" outlined> </v-select>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0">
                <v-select :items="[]" label="แขวง" outlined> </v-select>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
                <v-select :items="[]" label="เขต" outlined> </v-select>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
                <v-text-field
                  label="รหัสไปรษณีย์"
                  value="73000"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0 pl-lg-6">
                <v-text-field
                  label="โทรศัพท์"
                  value="0886578647"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>

          <div class="mt-6 mb-6">
            <v-btn
              color="primary"
              large
              class="col-12 col-lg-2"
              @click="edit()"
            >
              <v-icon left> mdi-book-edit </v-icon>
              แก้ไขทะเบียนครัวเรือน
            </v-btn>

            <v-btn
              large
              elevation="1"
              class="col-12 col-lg-2 ml-0 ml-lg-4 mt-4 mt-lg-0"
              @click="e1 = 1"
            >
              <v-icon left> mdi-arrow-left-circle</v-icon>
              ย้อนกลับ
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumbs";
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      e1: 1,
      title: "แก้ไขทะเบียนครัวเรือน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "ทะเบียนครัวเรือน",
          disabled: false,
          href: "house-holds",
        },
        {
          text: "แก้ไข",
          disabled: false,
          href: "house-holds-edit",
        },
      ],
    };
  },
  methods: {
    edit() {
      this.$router.push("/house-holds");
    },
  },
};
</script>

<style></style>
