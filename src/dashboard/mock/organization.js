import Mock from 'mockjs';
import faker from 'faker';

function paginator(items, page, per_page) {

  const offset = (page - 1) * per_page,
    paginatedItems = items.slice(offset).slice(0, per_page),
    total_pages = Math.ceil(items.length / per_page);

  return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: (total_pages > page) ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: paginatedItems
  };
}

const organizations = Mock.mock({
  'data|11': [{
    id: function () {
      return Mock.Random.guid()
    },
    name: function () {
      return faker.company.companyName();
    },
    created_at: '@datetime',
  }],
});

function getOrgs(req, res) {
  const { page = 1, per_page = 10 } = req.query;
  const result = paginator(organizations.data, parseInt(page), parseInt(per_page));
  res.send({
    total: result.total,
    data: result.data,
  });
}

export default {
  'GET /api/organizations': getOrgs,
};