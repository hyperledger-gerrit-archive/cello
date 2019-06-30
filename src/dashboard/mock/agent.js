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

const agents = Mock.mock({
  'data|11': [{
    id: function () {
      return Mock.Random.guid()
    },
    name: function () {
      return faker.company.companyName();
    },
    created_at: '@datetime',
    worker_api: function () { return Mock.Random.ip() },
    capacity: function () { return Math.ceil(Math.random()*10) },
    node_capacity: function () { return Math.ceil(Math.random()*10) },
    status: function () { return Mock.Random.pick(['inactive', 'active']) },
    log_level: function () { return Mock.Random.pick(['info', 'debug']) },
    type: function () { return Mock.Random.pick(['docker', 'kubernetes']) },
    schedulable: function () { return Mock.Random.pick([true, false]) },
    organization_id: function () { return Mock.Random.guid() },
  }],
});

function getAgents(req, res) {
  const { page = 1, per_page = 10 } = req.query;
  const result = paginator(agents.data, parseInt(page), parseInt(per_page));
  res.send({
    total: result.total,
    data: result.data,
  });
}

export default {
  'GET /api/agents': getAgents,
};
