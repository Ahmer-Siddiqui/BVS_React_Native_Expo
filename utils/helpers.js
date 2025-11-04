export const validateCnic = (cnic) => {
  return typeof cnic === 'string' && cnic.trim().length === 13;
};
