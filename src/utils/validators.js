export const validators = {
  regimentNo: (value) => {
    if (!value) return 'Regiment number is required';
    if (!/^[a-zA-Z0-9]{1,30}$/.test(value)) {
      return 'Regiment number must be 1-30 alphanumeric characters';
    }
    return null;
  },

  phoneNo: (value) => {
    if (!value) return 'Phone number is required';
    if (!/^[6-9]\d{9}$/.test(value)) {
      return 'Enter a valid 10-digit Indian phone number';
    }
    return null;
  },

  email: (value) => {
    if (!value) return 'Email is required';
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      return 'Enter a valid email address';
    }
    return null;
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(value)) return 'Password must contain a lowercase letter';
    if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain an uppercase letter';
    if (!/(?=.*\d)/.test(value)) return 'Password must contain a number';
    if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain a special character';
    return null;
  },

  name: (value) => {
    if (!value) return 'Name is required';
    if (value.length > 50) return 'Name cannot exceed 50 characters';
    return null;
  },

  roomNo: (value) => {
    if (!value) return 'Room number is required';
    if (value.length > 10) return 'Room number cannot exceed 10 characters';
    return null;
  },

  required: (value, fieldName = 'This field') => {
    if (!value) return `${fieldName} is required`;
    return null;
  }
};

export const validateForm = (data, rules) => {
  const errors = {};
  for (const [field, validator] of Object.entries(rules)) {
    const error = validator(data[field]);
    if (error) errors[field] = error;
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};
