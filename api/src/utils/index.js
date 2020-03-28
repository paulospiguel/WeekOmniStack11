module.exports = {
  handleCode(code) {
    switch (code) {
      case 200:
        return "OK";
      case 204:
        return "No Content";
      case 400:
        return "Bad Request";
      case 401:
        return "Unauthorized";
      case 404:
        return "Not Found";
      case 403:
        return "Forbidden";
      case 500:
        return "Internal Server Error";
      case 503:
        return "Service Unavailable";
      default:
        break;
    }
  },
  responsebuilder(data, pages = {}) {
    return {
      status: this.handleCode(200),
      code: 200,
      page: Number(pages.page) || 0,
      total_pages: Math.ceil(pages.total_pages) || 0,
      total_results: data.length || 1,
      version: "apiV1",
      data: data
    };
  },

  responsebuilderError(data, code) {
    return {
      status: this.handleCode(code),
      code,
      version: "apiV1",
      data: {
        attributes: data
      }
    };
  }
};
