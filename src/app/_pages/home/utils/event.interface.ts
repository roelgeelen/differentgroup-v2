export interface IEvent {
  subject: string;
  categories: string[];
  start: {dateTime: Date};
  bodyPreview: number;
}
