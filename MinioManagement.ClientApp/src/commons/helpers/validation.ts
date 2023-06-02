const validate = {
  validateEmail: (email: string): boolean => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return false;
    }
    return true;
  },

  isNullOrEmpty: (value: any) => {
    if (value === undefined || value === null || value === '' || value.length === 0) {
      return true;
    } else {
      return false;
    }
  },
  isNullOrEmptyObj: (value: any) => {
    if (validate.isNullOrEmpty(value)) {
      return true;
    }
    if (value.length === 0) {
      return true;
    }
    return false;
  },
};

export { validate };
