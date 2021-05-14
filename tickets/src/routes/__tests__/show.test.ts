import request from "supertest";
import { app } from "../../app";

it("returns a 400 if the ticket id is not valid", async () => {
  await request(app).get(`/api/tickets/random_fake_id`).send().expect(400);
});

it("returns a 404 if the ticket is not found", async () => {
  await request(app)
    .get(`/api/tickets/537eed02ed345b2e039652d2`)
    .send()
    .expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const cookie = global.login();
  const title = "Concert";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
