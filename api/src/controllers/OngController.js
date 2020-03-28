const connection = require("../database/connection");
const crypto = require("crypto");
const util = require("../utils");

module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query;

    const [count] = await connection("ongs").count();

    const ongs = await connection("ongs")
      .limit(5)
      .offset((page - 1) * 5)
      .select("*");

    const pages = {
      total_pages: count["count(*)"] / 5,
      page
    };

    response.header("X-Total-Count", count["count(*)"]);

    return response.json(util.responsebuilder(ongs, pages));
  },

  async create(request, response) {
    const { name, email, whatsapp, city, uf } = request.body;

    const id = crypto.randomBytes(4).toString("HEX");

    await connection("ongs").insert({
      id,
      name,
      email,
      whatsapp,
      city,
      uf
    });

    return response.json(util.responsebuilder({ id: id }));
  }
};
