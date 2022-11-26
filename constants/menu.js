export default [
  // {
  //   title: "หน้าแรก",
  //   subMenus: [
  //     {
  //       text: "หน้าแรก",
  //       icon: "mdi-home",
  //       active: false,
  //       to: "/",
  //       level: [1],
  //     },
  //   ],
  // },
  // {
  //   title: "จัดการสิทธิ์การใช้งาน",
  //   subMenus: [
  //     {
  //       text: "สิทธิ์การใช้งาน",
  //       icon: "mdi-shield-check",
  //       active: false,
  //       to: "/roles",
  //       level: [1],
  //     },
  //     //   {
  //     //     text: "แก้ไขบทบาท",
  //     //     icon: "mdi-shield-edit ",
  //     //     active: false,
  //     //     to: "/roles/edit",
  //     //   },
  //   ],
  // },
  {
    title: "ข้อมูลพื้นฐาน",
  subMenus: [
    {
      text: "ข้อมูลชุมชน",
      icon: "mdi-home-group",
      active: false,
      to: "/community-info",
      level: [1],
    },
    {
      text: "ตรอก/ซอย",
      icon: "mdi-source-repository-multiple",
      active: false,
      to: "/alley",
      level: [1],
    },
    {
      text: "ถนน",
      icon: "mdi-road",
      active: false,
      to: "/road",
      level: [1],
    },
    {
      text: "แขวง",
      icon: "mdi-home-city",
      active: false,
      to: "/district",
      level: [1],
    },
    {
      text: "เขต",
      icon: "mdi-home-city",
      active: false,
      to: "/zone",
      level: [1],
    },
  ],
  },
  {
    title: "จัดการครัวเรือน",
    subMenus: [
      {
        text: "ทะเบียนครัวเรือน",
        icon: "mdi-home ",
        active: false,
        to: "house-holds",
        level: [1],
      },
      {
        text: "เพิ่มทะเบียนครัวเรือน",
        icon: "mdi-home-plus ",
        active: false,
        to: "add-house-holds",
        level: [1],
      },
      {
        text: "แก้ไขเบียนครัวเรือน",
        icon: "mdi-home-edit ",
        active: false,
        to: "/edit-house-holds",
        level: [1],
      },
      {
        text: "เพิ่มหัวหน้าครัวเรือน",
        icon: "mdi-home-account ",
        active: false,
        to: "/add-head-house-holds",
        level: [1],
      },
      {
        text: "เพิ่มอาสาสมัคร",
        icon: "mdi-shield-account",
        active: false,
        to: "/accounts",
        level: [1],
      },
    ],
  },
  {
    title: "จัดการสมาชิกครัวเรือน",
    subMenus: [
      {
        text: "เพิ่มสมาชิกครัวเรือน",
        icon: "mdi-book-open-variant ",
        active: false,
        to: "/persons",
        level: [1],
      },
    ],
  },
  {
    title: "จัดการคณะกรรมการชุมชน",
    subMenus: [
      {
        text: "คณะกรรมการชุมชน",
        icon: "mdi-account-multiple",
        active: false,
        to: "/community-board",
        level: [1],
      },
      // {
      //   text: "แก้ไขคณะกรรมการชุมชน",
      //   icon: "mdi-account-multiple",
      //   active: false,
      //   to: "/edit-community-board",
      //   level: [1],
      // },
    ],
  },
  {
    title: "การใช้งาน",
    subMenus: [
      {
        text: "ออกจากระบบ",
        icon: "mdi-logout",
        active: false,
        to: "/login",
        level: [1],
      },
    ],
  },
];
