import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Switch,
  Icon,
  InputNumber,
  Upload,
  message,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import isIP from 'validator/lib/isIP';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getAuthority } from '@/utils/authority';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ agent, loading }) => ({
  agent,
  submitting: loading.effects['agent/createAgent'],
  updating: loading.effects['agent/updateAgent'],
  loadingAgent: loading.effects['agent/getAgent'],
}))
@Form.create()
class CreateAgent extends PureComponent {
  constructor(props) {
    super(props);
    const { location } = this.props;
    const { query = {} } = location;
    const action = query.action || 'create';

    if (action === 'edit') {
      const id = query.id || '';

      this.state = {
        userRole: getAuthority()[0],
        action,
        id,
      };
    } else {
      this.state = {
        action,
      };
    }
  }

  componentDidMount() {
    const { action, id } = this.state;
    const { dispatch } = this.props;

    if (action === 'edit') {
      dispatch({
        type: 'agent/getAgent',
        payload: { id },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'agent/clear',
    });
  }

  clickCancel = () => {
    router.push('/operator/agent');
  };

  validateIp = (rule, value, callback) => {
    if (value !== '') {
      if (!isIP(value)) {
        callback(
          <FormattedMessage
            id="app.operator.newAgent.error.ip"
            defaultMessage="Please enter a valid IP address.For example:192.168.0.10."
          />
        );
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  validateCreateResponse = data => {
    message.success(
      formatMessage(
        {
          id: 'app.operator.newAgent.success',
          defaultMessage: 'Create agent {name} success',
        },
        {
          name: data.payload.formData.get('name'),
        }
      )
    );
    router.push('/operator/agent');
  };

  validateUpdateResponse = () => {
    message.success(
      formatMessage({
        id: 'app.operator.updateAgent.success',
        defaultMessage: 'Update agent success',
      })
    );
    router.push('/operator/agent');
  };

  submitCallback = data => {
    const { action } = this.state;

    switch (action) {
      case 'create':
        this.validateCreateResponse(data);
        break;
      case 'edit':
        this.validateUpdateResponse(data);
        break;
      default:
        break;
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { action } = this.state;
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (action === 'edit') {
          const formData = new FormData();
          const { id, userRole } = this.state;
          const fun = userRole === 'operator' ? 'PUT' : 'PATCH';

          formData.append('name', values.name);
          formData.append('capacity', values.capacity);
          formData.append('log_level', values.log_level);

          if (userRole === 'operator') {
            formData.append('schedulable', values.schedulable);
          }

          dispatch({
            type: 'agent/updateAgent',
            payload: {
              data: formData,
              id,
              fun,
            },
            callback: this.submitCallback,
          });
        } else {
          const formData = new FormData();

          Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
          });

          dispatch({
            type: 'agent/createAgent',
            payload: {
              formData,
            },
            callback: this.submitCallback,
          });
        }
      }
    });
  };

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList.length > 0 ? e.file : null;
  };

  render() {
    const { action, userRole } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
      agent: { agent },
      submitting,
      updating,
      loadingAgent,
    } = this.props;
    const configFile = agent.config_file ? agent.config_file : '';
    const schedulable = action === 'edit' ? agent.schedulable : true;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const agentTypeValues = ['docker', 'kubernetes'];
    const agentTypeOptions = agentTypeValues.map(item => (
      <Option value={item} key={item}>
        <span>{item}</span>
      </Option>
    ));
    const logLevelValues = ['info', 'warning', 'debug', 'error', 'critical'];
    const logLevelOptions = logLevelValues.map(item => (
      <Option value={item} key={item}>
        <span>{item}</span>
      </Option>
    ));

    const uploadProps = {
      onRemove: () => {},
      beforeUpload: () => {
        return false;
      },
    };

    const disabledFontColor = { color: '#80837c' };

    return (
      <PageHeaderWrapper
        title={
          action === 'create' ? (
            <FormattedMessage id="app.operator.newAgent.title" defaultMessage="Create Agent" />
          ) : (
            <FormattedMessage id="app.operator.editAgent.title" defaultMessage="Edit Agent" />
          )
        }
      >
        <Card bordered={false} loading={action === 'edit' ? loadingAgent : false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem
              {...formItemLayout}
              label={
                <FormattedMessage id="app.operator.newAgent.label.name" defaultMessage="Name" />
              }
            >
              {getFieldDecorator('name', {
                initialValue: action === 'create' ? '' : agent.name,
                rules: [
                  {
                    required: false,
                    message: (
                      <FormattedMessage
                        id="app.operator.newAgent.Required.Name"
                        defaultMessage="Please input name."
                      />
                    ),
                  },
                ],
              })(
                <Input
                  placeholder={formatMessage({
                    id: 'app.operator.newAgent.label.name',
                    defaultMessage: 'Name',
                  })}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <FormattedMessage
                  id="app.operator.newAgent.label.ip"
                  defaultMessage="Agent IP Address"
                />
              }
            >
              {getFieldDecorator('ip', {
                initialValue: action === 'create' ? '' : agent.ip,
                rules: [
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="app.operator.newAgent.required.ip"
                        defaultMessage="Please input the ip address of the agent."
                      />
                    ),
                  },
                  {
                    validator: this.validateIp,
                  },
                ],
              })(
                <Input
                  disabled={action === 'edit'}
                  style={action === 'edit' ? disabledFontColor : {}}
                  placeholder="192.168.0.10"
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <FormattedMessage
                  id="app.operator.newAgent.label.image"
                  defaultMessage="Image name of deploy agent"
                />
              }
            >
              {getFieldDecorator('image', {
                initialValue: action === 'create' ? '' : agent.image,
                rules: [
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="app.operator.newAgent.required.image"
                        defaultMessage="Please input the name of the agent's image."
                      />
                    ),
                  },
                ],
              })(
                <Input
                  placeholder={formatMessage({
                    id: 'app.operator.newAgent.label.image',
                    defaultMessage: 'Image name of deploy agent',
                  })}
                  disabled={action === 'edit'}
                  style={action === 'edit' ? disabledFontColor : {}}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <FormattedMessage
                  id="app.operator.newAgent.label.agentCapacity"
                  defaultMessage="Capacity of agent"
                />
              }
            >
              {getFieldDecorator('capacity', {
                initialValue: action === 'create' ? 1 : agent.capacity,
                rules: [
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="app.operator.newAgent.required.agentCapacity"
                        defaultMessage="Please input the capacity of the agent."
                      />
                    ),
                  },
                ],
              })(
                <InputNumber
                  placeholder={formatMessage({
                    id: 'app.operator.newAgent.label.agentCapacity',
                    defaultMessage: 'Capacity of agent',
                  })}
                  min={1}
                  max={100}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <FormattedMessage
                  id="app.operator.newAgent.label.nodeCapacity"
                  defaultMessage="Capacity of nodes"
                />
              }
            >
              {getFieldDecorator('node_capacity', {
                initialValue: action === 'create' ? 10 : agent.node_capacity,
                rules: [
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="app.operator.newAgent.required.nodeCapacity"
                        defaultMessage="Please input the capacity of nodes."
                      />
                    ),
                  },
                ],
              })(
                <InputNumber
                  disabled={action !== 'create'}
                  placeholder={formatMessage({
                    id: 'app.operator.newAgent.label.nodeCapacity',
                    defaultMessage: 'Capacity of nodes',
                  })}
                  min={1}
                  max={600}
                  style={action === 'edit' ? disabledFontColor : {}}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <FormattedMessage id="app.operator.newAgent.label.type" defaultMessage="Type" />
              }
            >
              {getFieldDecorator('type', {
                initialValue: action === 'create' ? agentTypeValues[0] : agent.type,
                rules: [
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="app.operator.newAgent.Required.type"
                        defaultMessage="Please select a type."
                      />
                    ),
                  },
                ],
              })(
                <Select
                  style={action === 'edit' ? disabledFontColor : {}}
                  disabled={action !== 'create'}
                >
                  {agentTypeOptions}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <FormattedMessage
                  id="app.operator.newAgent.label.configFile"
                  defaultMessage="Config file"
                />
              }
            >
              {getFieldDecorator('config_file', {
                getValueFromEvent: this.normFile,
                initialValue: null,
              })(
                action === 'edit' ? (
                  <a href={configFile}>{configFile.substring(configFile.lastIndexOf('/') + 1)}</a>
                ) : (
                  <Upload {...uploadProps}>
                    <Button disabled={getFieldValue('config_file')}>
                      <Icon type="upload" />
                      {
                        <FormattedMessage
                          id="app.operator.newAgent.label.configFileSelect"
                          defaultMessage="Please select the config file."
                        />
                      }
                    </Button>
                  </Upload>
                )
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <FormattedMessage
                  id="app.operator.newAgent.label.logLevel"
                  defaultMessage="Log level"
                />
              }
            >
              {getFieldDecorator('log_level', {
                initialValue: action === 'create' ? logLevelValues[0] : agent.log_level,
                rules: [
                  {
                    required: false,
                    message: (
                      <FormattedMessage
                        id="app.operator.newAgent.Required.LogLevel"
                        defaultMessage="Please select a log level."
                      />
                    ),
                  },
                ],
              })(<Select>{logLevelOptions}</Select>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <FormattedMessage
                  id="app.operator.newAgent.label.schedulable"
                  defaultMessage="Schedulable"
                />
              }
            >
              {getFieldDecorator('schedulable', {
                initialValue: schedulable,
              })(
                <Switch
                  disabled={action === 'edit' && userRole !== 'operator'}
                  defaultChecked={schedulable}
                />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button onClick={this.clickCancel}>
                <FormattedMessage id="form.button.cancel" defaultMessage="Cancel" />
              </Button>
              <Button
                loading={action === 'create' ? submitting : updating}
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage id="form.button.submit" defaultMessage="Submit" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default withRouter(CreateAgent);
