export const NEWBORN = {
  1: "1",
  2: "2",
  3: "3",
};

export const NEWBORN_TEXT = {
  [NEWBORN[1]]: "ต่ำกว่า 6 เดือน",
  [NEWBORN[2]]: "2 เดือน ถึง 2 ปีครึ่ง",
  [NEWBORN[3]]: "2 ปีครึ่ง ถึง 6 ปี",
};

export const NEWBORN_OPTIONS = [
  {
    value: NEWBORN[1],
    text: NEWBORN_TEXT[1],
  },
  {
    value: NEWBORN[2],
    text: NEWBORN_TEXT[2],
  },
  {
    value: NEWBORN[3],
    text: NEWBORN_TEXT[3],
  },
];
