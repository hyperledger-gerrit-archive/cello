export function getOrgs(req, res) {
    const page = typeof(req.query.page) === 'undefined' ? 1 : req.query.page;
    const per_page = typeof(req.query.per_page) === 'undefined' ? 10 : req.query.per_page;
    const name = typeof(req.query.name) === 'undefined' ? '' : req.query.name;
    const orgs = [
        {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'org1-cello',
            created_at: '2019-05-29T12:59:46.845Z'
        },
        {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
            name: 'org2-cello',
            created_at: '2019-05-22T12:59:46.845Z'
        },
        {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
            name: 'org3-cello',
            created_at: '2019-05-22T12:52:46.845Z'
        },
        {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa9',
            name: 'org4-cello',
            created_at: '2019-05-22T12:25:46.845Z'
        }
    ];

    return res.json({
        total: orgs.length,
        data: orgs
    });
}

export default {
  'GET /api/organizations': getOrgs,
};