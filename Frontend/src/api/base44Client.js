// Local mock adapter for Base44 client during local migration
export const base44 = {
  auth: {
    me: async () => null,
    updateMe: async (data) => data,
  },
  // Add fallback handlers for any data entities your app queries
  entities: {
    list: async () => [],
    get: async () => null,
    create: async (data) => data,
    update: async (data) => data,
    delete: async () => {},
  },
  integrations: {
    Core: {
      UploadFile: async () => ({ url: '' }),
    }
  }
};