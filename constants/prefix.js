export const PREFIX = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
};

export const PREFIX_TEXT = {
  [PREFIX[1]]: "นางสาว",
  [PREFIX[2]]: "นาง",
  [PREFIX[3]]: "นาย",
  [PREFIX[4]]: "เด็กหญิง",
  [PREFIX[5]]: "เด็กชาย",
};

export const PREFIX_OPTIONS = [
  {
    value: PREFIX[1],
    text: PREFIX_TEXT[1],
  },
  {
    value: PREFIX[2],
    text: PREFIX_TEXT[2],
  },
  {
    value: PREFIX[3],
    text: PREFIX_TEXT[3],
  },
  {
    value: PREFIX[4],
    text: PREFIX_TEXT[4],
  },
  {
    value: PREFIX[5],
    text: PREFIX_TEXT[5],
  },
];
