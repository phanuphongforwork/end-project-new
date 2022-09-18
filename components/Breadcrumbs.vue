<template>
  <div>
    <v-row>
      <v-col v-if="items.length > 1">
        <v-breadcrumbs class="mt-6" :items="items" large>
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item nuxt :to="item.href" :disabled="item.disabled">
              {{ item.text.toUpperCase() }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>

    <v-row v-if="title">
      <v-col class="text-h4"> {{ title }} </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    // items: [
    //   {
    //     text: "หน้าแรก",
    //     disabled: false,
    //     href: "/",
    //   },
    //   {
    //     text: "ทะเบียนครัวเรือน",
    //     disabled: false,
    //     href: "/",
    //   },
    // ],
  }),
};
</script>

<style></style>
