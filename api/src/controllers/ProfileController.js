const connection = require("../database/connection");
const util = require("../utils");

module.exports = {
  async index(request, response) {
    const ong_id = request.headers.authorization;

    try {
      const result = await connection("incidents").where("ong_id", ong_id);

      return response.json(util.responsebuilder(result));
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
