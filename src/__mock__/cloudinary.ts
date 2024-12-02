export const cloudinary = {
  uploader: {
    destroy: jest.fn().mockResolvedValue({ result: "ok" }),
  },
};

export const storage = {
  _handleFile: jest.fn((_req: any, _file: any, cb: any) => {
    cb(null, {
      path: "mock-file-path",
      filename: "mock-filename",
    });
  }),
};
