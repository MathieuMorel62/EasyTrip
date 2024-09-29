// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PropTypes from 'prop-types';

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full">
      <Input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pr-10 w-full"
      />
      <div
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        onClick={toggleShowPassword}
      >
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </div>
    </div>
  );
};

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default PasswordInput;
