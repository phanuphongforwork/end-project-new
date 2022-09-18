export default [
  {
    title: "หน้าแรก",
    subMenus: [
      {
        text: "หน้าแรก",
        icon: "mdi-home",
        active: false,
        to: "/",
      },
    ],
  },
  {
    title: "จัดการบทบาท",
    subMenus: [
      {
        text: "บทบาท",
        icon: "mdi-shield-check",
        active: false,
        to: "/roles",
      },
      //   {
      //     text: "แก้ไขบทบาท",
      //     icon: "mdi-shield-edit ",
      //     active: false,
      //     to: "/roles/edit",
      //   },
    ],
  },
  {
    title: "จัดการผู้ใช้งาน",
    subMenus: [
      {
        text: "บัญชีผู้ใช้งาน",
        icon: "mdi-account-box ",
        active: false,
        to: "/accounts",
      },
      //   {
      //     text: "แก้ไขบัญชีผู้ใช้งาน",
      //     icon: "mdi-account-edit  ",
      //     active: false,
      //     to: "/",
      //   },
    ],
  },
  {
    title: "จัดการทะเบียนครัวเรือน",
    subMenus: [
      {
        text: "ทะเบียนครัวเรือน",
        icon: "mdi-book-open-variant ",
        active: false,
        to: "/house-holds",
      },
      {
        text: "แก้ไขทะเบียนครัวเรือน",
        icon: "mdi-file-document-edit",
        active: false,
        to: "/house-holds/edit",
      },
    ],
  },
  {
    title: "จัดการบุคคลในครัวเรือน",
    subMenus: [
      {
        text: "บุคคลในครัวเรือน",
        icon: "mdi-account-multiple",
        active: false,
        to: "/persons",
      },
      {
        text: "แก้ไขบุคคลในครัวเรือน",
        icon: "mdi-account-wrench",
        active: false,
        to: "/persons/edit",
      },
    ],
  },
];
