export const ROLE = {
  1: "1",
  2: "2",
  3: "3",
};

export const ROLE_TEXT = {
  [ROLE[1]]: "ผู้ดูแลระบบ",
  [ROLE[2]]: "อาสาสมัคร",
  [ROLE[3]]: "สมาชิกชุมชน",
};

export const ROLE_COLOR = {
  [ROLE[1]]: "primary",
  [ROLE[2]]: "info",
};

export const ROLE_OPTIONS = [
  {
    value: ROLE[1],
    text: ROLE_TEXT[1],
  },
  {
    value: ROLE[2],
    text: ROLE_TEXT[2],
  },
  {
    value: ROLE[3],
    text: ROLE_TEXT[3],
  },
];
