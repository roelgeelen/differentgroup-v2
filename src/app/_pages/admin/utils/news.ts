export interface INews {
  id?: string;
  title: string;
  message: string;
  published: boolean;
  date?: Date;
  image?: { id: string, uuid: string, pic: Blob };
  loadedImage?: any;
  url?: string;
  file?: FormData;
}
