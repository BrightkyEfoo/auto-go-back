export const ArrayCompare = (array1, array2) => {
  let equal = true;
  if (Array.isArray(array1) && Array.isArray(array2)) {
    array1.forEach(element => {
      equal &= array2.includes(element);
    });
    array2.forEach(element => {
      equal &= array1.includes(element);
    });
  } else {
    equal = false;
  }
  return equal;
};
