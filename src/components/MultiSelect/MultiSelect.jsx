import React, { useState } from 'react';
import { TreeSelect } from 'antd';
import { PERMISSIONS_DATA } from '../../../utils/permissions_data';
const { SHOW_PARENT } = TreeSelect;



const MultiSelect = () => {
  const [value, setValue] = useState('');
  const onChange = (newValue) => {
    console.log('onChange ', newValue);
    setValue(newValue);
  };

  function handlePermissions() {
    const data_send  = [
      ...newValue
    ]
  }
   
  const tProps = {
    treeData : PERMISSIONS_DATA,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: 'Please select',
    style: {
      width: '100%',
    },
  };
  return <TreeSelect {...tProps} />;
};
export default MultiSelect;