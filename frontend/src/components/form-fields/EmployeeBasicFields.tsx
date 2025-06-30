import React from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;

export const EmployeeBasicFields: React.FC = () => {
  return (
    <>
      <Form.Item
        name="first_name"
        label="First Name"
        rules={[
          { required: true, message: 'Please enter first name' },
          { max: 64, message: 'First name must be less than 64 characters' },
        ]}
      >
        <Input placeholder="Enter first name" />
      </Form.Item>

      <Form.Item
        name="last_name"
        label="Last Name"
        rules={[
          { required: true, message: 'Please enter last name' },
          { max: 64, message: 'Last name must be less than 64 characters' },
        ]}
      >
        <Input placeholder="Enter last name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter email' },
          { type: 'email', message: 'Please enter a valid email' },
          { max: 128, message: 'Email must be less than 128 characters' },
        ]}
      >
        <Input placeholder="Enter email address" />
      </Form.Item>

      <Form.Item
        name="position"
        label="Position"
        rules={[
          { max: 64, message: 'Position must be less than 64 characters' },
        ]}
      >
        <Input placeholder="Enter position/job title" />
      </Form.Item>

      <Form.Item
        name="home_phone"
        label="Home Phone"
        rules={[
          { max: 32, message: 'Phone number must be less than 32 characters' },
        ]}
      >
        <Input placeholder="Enter home phone number" />
      </Form.Item>

      <Form.Item
        name="notes"
        label="Notes"
      >
        <TextArea
          rows={4}
          placeholder="Enter any additional notes"
          maxLength={1000}
          showCount
        />
      </Form.Item>
    </>
  );
};