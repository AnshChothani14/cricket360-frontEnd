import React from 'react';
import { Table, Divider } from 'antd';
import './table.css'

const CustomTable = ({ columns, data, size, title }) => (
    <>
        <Divider> <h3>{title}</h3> </Divider>
        <Table
            className='tableBalling'
            columns={columns}
            dataSource={data}
            size={size}
            scroll={{ y: 300 }}
        />
    </>
);

export default CustomTable;
