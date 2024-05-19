declare module 'formidable' {
  import { IncomingMessage } from 'http';
  import { Stream } from 'stream';

  interface File {
    filepath: string;
    originalFilename?: string;
    mimetype?: string;
    size: number;
  }

  interface Files {
    [key: string]: File | File[];
  }

  interface Fields {
    [key: string]: string | string[];
  }

  interface Options {
    uploadDir?: string;
    keepExtensions?: boolean;
  }

  class IncomingForm {
    constructor(options?: Options);
    parse(req: IncomingMessage, callback: (err: any, fields: Fields, files: Files) => void): void;
  }

  export = IncomingForm;
}
