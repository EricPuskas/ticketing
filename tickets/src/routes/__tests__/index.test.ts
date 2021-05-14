import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

const createTicket = ({ title, price }: { title: string; price: number }) => {
  return request(app).post("/api/tickets").set("Cookie", global.login()).send({
    title: title,
    price: price,
  });
};

it("can fetch a list of tickets", async () => {
  await createTicket({ title: "Test Title 1", price: 20 }).expect(201);
  await createTicket({ title: "Test Title 2", price: 20 }).expect(201);
  await createTicket({ title: "Test Title 3", price: 20 }).expect(201);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
