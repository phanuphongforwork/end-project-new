<template>
  <v-breadcrumbs :items="items" large>
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item :href="item.href" :disabled="item.disabled">
        {{ item.text.toUpperCase() }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        text: "หน้าแรก",
        disabled: false,
        href: "/",
      },
      {
        text: "ทะเบียนครัวเรือน",
        disabled: false,
        href: "/",
      },
    ],
  }),
};
</script>

<style></style>
