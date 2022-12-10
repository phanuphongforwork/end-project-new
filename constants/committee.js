export const COMMITTEE = {
  0: "0",
  1: "1",
};

export const COMMITTEE_TEXT = {
  [COMMITTEE[0]]: "ออก",
  [COMMITTEE[1]]: "ยังอยู่",
};

export const COMMITTEE_OPTIONS = [
  {
    value: COMMITTEE[0],
    text: COMMITTEE_TEXT[0],
  },
  {
    value: COMMITTEE[1],
    text: COMMITTEE_TEXT[1],
  },
];
