const request = require("supertest");
const app = require("./app");

describe("GET posts endpoint", () => {
  test("should return the posts", async () => {
    let response = await request(app)
			.get("/posts").expect(200);
		expect(response.body[0].id).toBeTruthy;
		expect(response.body[0].title).toBeTruthy;
		expect(response.body[0].url).toBeTruthy;
		expect(response.body[0].name).toBeTruthy;
  });
});

describe("POST posts endpoint", () => {
  test("insert post to database", async () => {
		const newPost = {
    "title": "Test Post",
    "url": "9gag.com",
    "owner_Id": 1
		}
    let response = await request(app)
			.post("/posts").expect(201)
			.send(newPost)
		expect(response.body.id).toBeTruthy();
		expect(response.body.title).toBe("Test Post");
		expect(response.body.url).toBe("9gag.com");
		expect(response.body.name).toBeTruthy();

  });
});

