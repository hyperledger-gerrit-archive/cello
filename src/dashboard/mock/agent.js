export function getAgents(req, res) {
  const page = typeof(req.query.page) === 'undefined' ? 1 : req.query.page;
  const per_page = typeof(req.query.per_page) === 'undefined' ? 10 : req.query.per_page;
  const name = typeof(req.query.name) === 'undefined' ? '' : req.query.name;
  const agents = [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'agent1-cello',
      created_at: '2019-05-29T12:59:46.845Z',
      worker_api: '192.168.0.10',
      capacity: 10,
      node_capacity: 10,
      status: 'active',
      log_level: 'info',
      type: 'docker',
      schedulable: true,
      organization_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
      name: 'agent2-cello',
      created_at: '2019-05-22T12:59:46.845Z',
      worker_api: '192.168.0.10',
      capacity: 10,
      node_capacity: 10,
      status: 'active',
      log_level: 'info',
      type: 'kubernetes',
      schedulable: true,
      organization_id: '3fa85f64-5717-4562-b3fc-2c963f66afa7'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
      name: 'agent3-cello',
      created_at: '2019-05-22T12:52:46.845Z',
      worker_api: '192.168.0.10',
      capacity: 10,
      node_capacity: 10,
      status: 'active',
      log_level: 'info',
      type: 'docker',
      schedulable: true,
      organization_id: '3fa85f64-5717-4562-b3fc-2c963f66afa8'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa9',
      name: 'agent4-cello',
      created_at: '2019-05-22T12:25:46.845Z',
      worker_api: '192.168.0.10',
      capacity: 10,
      node_capacity: 10,
      status: 'inactive',
      log_level: 'info',
      type: 'docker',
      schedulable: true,
      organization_id: '3fa85f64-5717-4562-b3fc-2c963f66afa9'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afb0',
      name: 'agent5-cello',
      created_at: '2019-05-22T12:25:46.845Z',
      worker_api: '192.168.0.10',
      capacity: 10,
      node_capacity: 10,
      status: 'active',
      log_level: 'info',
      type: 'docker',
      schedulable: true,
      organization_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afb1',
      name: 'agent6-cello',
      created_at: '2019-05-29T12:59:46.845Z',
      worker_api: '192.168.0.10',
      capacity: 10,
      node_capacity: 10,
      status: 'active',
      log_level: 'info',
      type: 'docker',
      schedulable: true,
      organization_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afb2',
      name: 'agent7-cello',
      created_at: '2019-05-22T12:59:46.845Z',
      worker_api: '192.168.0.10',
      capacity: 10,
      node_capacity: 10,
      status: 'active',
      log_level: 'info',
      type: 'docker',
      schedulable: true,
      organization_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afb3',
      name: 'agent8-cello',
      created_at: '2019-05-22T12:52:46.845Z',
      worker_api: '192.168.0.10',
      capacity: 10,
      node_capacity: 10,
      status: 'active',
      log_level: 'info',
      type: 'docker',
      schedulable: true,
      organization_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afb4',
      name: 'agent9-cello',
      created_at: '2019-05-22T12:25:46.845Z',
      worker_api: '192.168.0.10',
      capacity: 10,
      node_capacity: 10,
      status: 'active',
      log_level: 'info',
      type: 'docker',
      schedulable: true,
      organization_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afb5',
      name: 'agent10-cello',
      created_at: '2019-05-22T12:25:46.845Z',
      worker_api: '192.168.0.10',
      capacity: 10,
      node_capacity: 10,
      status: 'active',
      log_level: 'info',
      type: 'docker',
      schedulable: true,
      organization_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afb6',
      name: 'agent11-cello',
      created_at: '2019-05-22T12:25:46.845Z',
      worker_api: '192.168.0.10',
      capacity: 10,
      node_capacity: 10,
      status: 'active',
      log_level: 'info',
      type: 'kubernetes',
      schedulable: true,
      organization_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    }
  ];

  return res.json({
    total: agents.length,
    data: agents
  });
}

export default {
  'GET /api/agents': getAgents,
};
