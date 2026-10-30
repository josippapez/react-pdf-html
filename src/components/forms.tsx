import React, { FC } from "react";
import { Checkbox, FieldSet, List, Select, TextInput } from "../primitives";
import { useIsHtml } from "../renderMode";
import { toCSS } from "../styles";
import type {
  PropsCheckbox,
  PropsFieldSet,
  PropsList,
  PropsSelect,
  PropsTextInput,
} from "../Types";

// PDF form fields. In HTML they become the matching native form controls.
export const CustomFieldSet: FC<PropsFieldSet> = ({
  children,
  style,
  ...rest
}) => {
  if (useIsHtml()) {
    return (
      <fieldset
        name={rest.name}
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          margin: 0,
          padding: 0,
          border: 0,
          ...toCSS(style),
        }}
      >
        {children}
      </fieldset>
    );
  }
  return (
    <FieldSet style={style} {...rest}>
      {children}
    </FieldSet>
  );
};

export const CustomTextInput: FC<PropsTextInput> = ({ style, ...rest }) => {
  if (useIsHtml()) {
    const field = {
      name: rest.name,
      defaultValue: rest.value ?? rest.defaultValue,
      readOnly: rest.readOnly,
      required: rest.required,
      maxLength: rest.maxLength,
      spellCheck: !rest.noSpell,
      style: {
        textAlign: rest.align,
        fontSize: rest.fontSize,
        ...toCSS(style),
      },
    };
    return rest.multiline ? (
      <textarea {...field} />
    ) : (
      <input type={rest.password ? "password" : "text"} {...field} />
    );
  }
  return <TextInput style={style} {...rest} />;
};

export const CustomCheckbox: FC<PropsCheckbox> = ({ style, ...rest }) => {
  if (useIsHtml()) {
    return (
      <input
        type="checkbox"
        name={rest.name}
        defaultChecked={rest.checked}
        disabled={rest.readOnly}
        required={rest.required}
        style={toCSS(style)}
      />
    );
  }
  return <Checkbox style={style} {...rest} />;
};

const SelectField: FC<PropsSelect & { list?: boolean }> = ({
  style,
  list,
  ...rest
}) => {
  const value = rest.value ?? rest.defaultValue;
  const options = rest.select ?? [];
  return (
    <select
      name={rest.name}
      defaultValue={rest.multiSelect && value != null ? [String(value)] : value}
      multiple={rest.multiSelect}
      size={list ? Math.max(options.length, 2) : undefined}
      disabled={rest.readOnly}
      required={rest.required}
      style={toCSS(style)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export const CustomSelect: FC<PropsSelect> = (props) => {
  if (useIsHtml()) {
    return <SelectField {...props} />;
  }
  return <Select {...props} />;
};

export const CustomList: FC<PropsList> = (props) => {
  if (useIsHtml()) {
    return <SelectField {...props} list />;
  }
  return <List {...props} />;
};
