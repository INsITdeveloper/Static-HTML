declare module 'telegraph-uploader' {
  export function uploadFile(fileStream: NodeJS.ReadableStream): Promise<{ link: string }>;
}
