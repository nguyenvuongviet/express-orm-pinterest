export async function paginate(model, queryArgs = {}, page = 1, pageSize = 3) {
  page = +page > 0 ? +page : 1;
  pageSize = +pageSize > 0 ? +pageSize : 3;
  const skip = (page - 1) * pageSize;

  const [items, totalItem] = await Promise.all([
    model.findMany({ ...queryArgs, skip, take: pageSize }),
    model.count({ where: queryArgs.where }),
  ]);

  const totalPage = Math.ceil(totalItem / pageSize);

  return {
    page,
    pageSize,
    totalItem,
    totalPage,
    items: items || [],
  };
}
