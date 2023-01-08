export default [
  {
    title: "หน้าแรก",
    subMenus: [
      {
        text: "หน้าแรก",
        icon: "mdi-home ",
        active: false,
        to: "/",
        level: [1, 2],
      },
    ],
  },
  {
    title: "ข้อมูลของฉัน",
    subMenus: [
      {
        text: "ทะเบียนบครัวเรือนของฉัน",
        icon: "mdi-home ",
        active: false,
        to: "/my-house",
        level: [3],
      },
    ],
  },
  {
    title: "ทะเบียนครัวเรือน",
    subMenus: [
      {
        text: "เพิ่มทะเบียนครัวเรือน",
        icon: "mdi-home ",
        active: false,
        to: "house-holds",
        level: [1, 2],
      },
      {
        text: "เพิ่มสมาชิกครัวเรือน",
        icon: "mdi-book-open-variant ",
        active: false,
        to: "/add-house-hold-members",
        level: [1],
      },
      {
        text: "เลือกหัวหน้าครัวเรือน",
        icon: "mdi-book-open-variant ",
        active: false,
        to: "/add-head-house-holds",
        level: [1],
      },

      {
        text: "เลือกอาสาสมัคร",
        icon: "mdi-shield-account",
        active: false,
        to: "/add-volunteer-house-holds",
        level: [1],
      },
      {
        text: "แก้ไขเบียนครัวเรือน",
        icon: "mdi-home-edit ",
        active: false,
        to: "/edit-house-holds",
        level: [1],
      },
    ],
  },
  {
    title: "สมาชิกชุมชน",
    subMenus: [
      {
        text: "เพิ่มสมาชิกชุมชน",
        icon: "mdi-account-plus ",
        active: false,
        to: "persons",
        level: [1],
      },

      {
        text: "แก้ไขสมาชิกชุมชน",
        icon: "mdi-account-edit ",
        active: false,
        to: "/edit-persons",
        level: [1, 2],
      },
    ],
  },

  {
    title: "คณะกรรมการชุมชน",
    subMenus: [
      {
        text: "เพิ่มกรรมการชุมชน",
        icon: "mdi-account-multiple",
        active: false,
        to: "/community-board",
        level: [1],
      },
      {
        text: "แก้ไขคณะกรรมการชุมชน",
        icon: "mdi-account-multiple",
        active: false,
        to: "/edit-community-board",
        level: [1],
      },
    ],
  },

  {
    title: "กิจกรรม",
    subMenus: [
      {
        text: "เพิ่มกิจกรรม",
        icon: "mdi-coffee",
        active: false,
        to: "/activities",
        level: [1],
      },
      {
        text: "ผู้เข้าร่วมกิจกรรม",
        icon: "mdi-coffee-to-go",
        active: false,
        to: "/edit-activity-members",
        level: [1],
      },
    ],
  },
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
    title: "การใช้งาน",
    subMenus: [
      {
        text: "ออกจากระบบ",
        icon: "mdi-logout",
        active: false,
        to: "/login",
        level: [1, 2, 3],
      },
    ],
  },
];
