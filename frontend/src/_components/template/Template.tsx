/* eslint-disable */ import React, { useEffect } from "react";

import { ITemplate } from ".";

import "./template.scss";

const Template: React.FC<ITemplate> = ({ children, ...props }): any | null => {
  const { template } = props;

  useEffect(() => {
    //
    console.log(template);
  }, []);

  return (
    <>
      <h1>Template</h1>
    </>
  );
};

export { Template };
