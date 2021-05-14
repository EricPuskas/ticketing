import { Subjects } from "./subjects";

export interface TickedCreatedEvent {
  subject: Subjects.TickedCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
