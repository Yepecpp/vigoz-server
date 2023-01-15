export const address = {
  street1: {
    type: String,
    required: true,
    lowercase: true,
  },
  street2: {
    type: String,
    lowercase: true,
  },
  city: {
    type: String,
    required: true,
    lowercase: true,
  },
  zip: {
    type: String,
    lowercase: true,
  },
};
export const identity = {
  type: {
    type: String,
    enum: ['id', 'passport'],
    default: 'id',
  },
  number: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
};

