const connection = require("../database/connection");
const util = require("../utils");

module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query;

    const [count] = await connection("incidents").count();

    const incidents = await connection("incidents")
      .join("ongs", "ongs.id", "=", "incidents.ong_id")
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        "incidents.*",
        "ongs.name",
        "ongs.email",
        "ongs.whatsapp",
        "ongs.city",
        "ongs.uf"
      ])
      .then(result => {
        return result.map(item => {
          console.log(item);
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            value: item.value,
            created_at: item.created_at,
            updated_at: item.updated_at,
            ong_information: {
              name: item.name,
              email: item.email,
              whatsapp: item.whatsapp,
              city: item.city,
              uf: item.uf
            }
          };
        });
      });

    const pages = {
      total_pages: count["count(*)"] / 5,
      page
    };

    return response.json(util.responsebuilder(incidents, pages));
  },

  async create(request, response) {
    const { title, description, value } = request.body;
    const ong_id = request.headers.authorization;

    const [id] = await connection("incidents").insert({
      title,
      description,
      value,
      ong_id
    });

    return response.json(util.responsebuilder({ id: id }));
  },

  async delete(request, response) {
    const { id } = request.params;
    const ong_id = request.headers.authorization;

    try {
      const incident = await connection("incidents")
        .where("id", id)
        .select("ong_id")
        .first();

      if (incident === undefined || incident.ong_id !== ong_id) {
        return response
          .status(401)
          .json(
            util.responsebuilderError(
              { error: "Operation not permitted." },
              401
            )
          );
      }

      await connection("incidents")
        .where("id", id)
        .delete();

      return response.status(204).send();
    } catch (error) {
      return response
        .status(500)
        .json(
          util.responsebuilderError(
            { error: "There was an error in your request, try later" },
            500
          )
        );
    }
  }
};
