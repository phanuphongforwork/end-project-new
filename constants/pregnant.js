export const PREGNANT = {
  1: "1",
  2: "2",
};

export const PREGNANT_TEXT = {
  [PREGNANT[1]]: "อายุ 20 ปีขึ้นไป",
  [PREGNANT[2]]: "อายุต่ำกว่า 20 ปี",
};

export const PREGNANT_OPTIONS = [
  {
    value: PREGNANT[1],
    text: PREGNANT_TEXT[1],
  },
  {
    value: PREGNANT[2],
    text: PREGNANT_TEXT[2],
  },
];
