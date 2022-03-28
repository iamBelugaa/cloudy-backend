module.exports = function paginate(req) {
  const { pageNumber, pageSize } = req.query;

  const number = pageNumber ? pageNumber : 1;
  const size = pageSize && pageSize <= 10 ? pageSize : 10;

  return { pageNumber: number, pageSize: size };
};
