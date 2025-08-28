/* eslint-disable */
type TemplateT = {
  foo: boolean;
};

interface ITemplate {
  template?: Array<TemplateT>;
  children?: React.ReactNode;
}

export type { TemplateT, ITemplate };
