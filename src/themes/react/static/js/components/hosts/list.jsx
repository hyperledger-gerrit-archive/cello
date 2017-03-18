/**
 * Created by yuehaitao on 2017/2/7.
 */
import React, { PropTypes } from 'react'
import { Badge, Tag, Button, Table, Popconfirm, Pagination } from 'antd'
import styles from './list.less'

function list({loadingList, dataSource, onDeleteItem, onSelectItem, onSelectTagItem}) {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <a onClick={() => onSelectItem(record.id)}>{text}</a>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <span>{text == "active" ? <Badge status="success" text={text}/> : <Badge status="warning" text={text} />}</span>
            )
        },
        {
            title: 'Create Time',
            dataIndex: 'create_ts',
            key: 'create_ts'
        },
        {
            title: 'Log Level',
            dataIndex: 'log_level',
            key: 'log_level'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'Log Type',
            dataIndex: 'log_type',
            key: 'log_type'
        },
        {
            title: 'Operation',
            key: 'operation',
            width: 100,
            render: (text, record) => (
                <p>
                    <Popconfirm title="Confirm to Delete？" onConfirm={() => onDeleteItem(record.id, record.name)}>
                        <a style={{color: "red"}}>Delete</a>
                    </Popconfirm>
                </p>
            )
        }
    ]

    return (
        <div>
            <Table
                className={styles.table}
                columns={columns}
                dataSource={dataSource}
                loading={loadingList}
                size="small"
                rowKey={record => record.id}
            />
        </div>
    )
}

list.propTypes = {
    loadingList: PropTypes.any,
    dataSource: PropTypes.array,
    pagination: PropTypes.any,
    onPageChange: PropTypes.func,
    onDeleteItem: PropTypes.func,
    onSelectItem: PropTypes.func,
    onSelectTagItem: PropTypes.func
}

export default list