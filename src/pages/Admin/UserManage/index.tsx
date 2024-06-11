import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable, TableDropdown} from '@ant-design/pro-components';
import {useRef} from 'react';
import {searchUsers} from "@/services/ant-design-pro/api";
import {Image} from "antd";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    copyable: true,
    ellipsis: true,
    tooltip: '数据过长会自动收缩',
  },
  {
    title: '用户账户',
    dataIndex: 'userAccount',
    ellipsis: true,
    copyable: true,
    // ellipsis: true,
    // tooltip: '数据过长会自动收缩',
  },
  {
    title: '头像',
    dataIndex: 'avatarUrl',
    render: (_, record) => {
      return <div>
        <Image src={record.avatarUrl} width={60} fallback={"\n" +
          "https://kusanagi.oss-cn-beijing.aliyuncs.com/touxiang/defaultava.png"}/>
      </div>;
    },
    copyable: true,
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: 60,
  },
  {
    title: '电话',
    dataIndex: 'phone',
    ellipsis: true,
    copyable: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    ellipsis: true,
    copyable: true,
  },
  {
    title: '状态',
    ellipsis: true,
    dataIndex: 'userStatus',
  },
  {
    title: '星球编号',
    ellipsis: true,
    dataIndex: 'planetCode',
  },
  {
    title: '创建时间',
    ellipsis: true,
    dataIndex: 'createTime',
    valueType: 'date',
  },
  {
    title: '角色',
    ellipsis: true,
    dataIndex: 'userRole',
    valueType: 'select',
    valueEnum: {
      0: {text: '普通用户', status: 'Default'},
      1: {text: '管理员', status: 'Success'},
      // open: {
      //   text: '未解决',
      //   status: 'Error',
      // },
      // closed: {
      //   text: '已解决',
      //   status: 'Success',
      //   disabled: true,
      // },
      // processing: {
      //   text: '解决中',
      //   status: 'Processing',
      // },
    },
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    ellipsis: true,
  },
  // {
  //   disable: true,
  //   title: '标签',
  //   dataIndex: 'labels',
  //   search: false,
  //   renderFormItem: (_, { defaultRender }) => {
  //     return defaultRender(_);
  //   },
  //   render: (_, record) => (
  //     <Space>
  //       {record.labels.map(({ name, color }) => (
  //         <Tag color={color} key={name}>
  //           {name}
  //         </Tag>
  //       ))}
  //     </Space>
  //   ),
  // },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          {key: 'copy', name: '复制'},
          {key: 'delete', name: '删除'},
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        console.log(sort, filter);
        await waitTime(2000);
        const userList = await searchUsers();
        return {
          data: userList
        }
        // return request<{
        //   data: CurrentUser[];
        // }>('https://proapi.azurewebsites.net/github/issues', {
        //   params,
        // });
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: {fixed: 'right', disable: true},
        },
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
    />
  );
};
