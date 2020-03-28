const connection = require("../database/connection");
const util = require("../utils");

module.exports = {
  async create(request, response) {
    const { id } = request.body;

    try {
      const ong = await connection("ongs")
        .where("id", id)
        .select("name")
        .first();

      if (!ong) {
        return response
          .status(400)
          .json(
            util.responsebuilderError(
              { error: "No ONG found with this ID." },
              400
            )
          );
      }

      return response.json(util.responsebuilder(ong));
    } catch (error) {
      return response
        .status(400)
        .json(
          util.responsebuilderError(
            { error: "There was an error in your request, try later" },
            400
          )
        );
    }
  }
};
