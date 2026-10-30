import type { FC } from "react";
import type {
  PropsCheckbox,
  PropsFieldSet,
  PropsImageBackground,
  PropsList,
  PropsMarker,
  PropsSelect,
  PropsTextInput,
} from "./Types";

// react-pdf's components are host element names, and these exist only in
// react-pdf 4. Using the names keeps react-pdf 3 builds free of missing
// export errors.
const hostElement = <Props>(name: string) => name as unknown as FC<Props>;
export const ImageBackground = hostElement<PropsImageBackground>("IMAGE_BACKGROUND");
export const Marker = hostElement<PropsMarker>("MARKER");
export const FieldSet = hostElement<PropsFieldSet>("FIELD_SET");
export const TextInput = hostElement<PropsTextInput>("TEXT_INPUT");
export const Checkbox = hostElement<PropsCheckbox>("CHECKBOX");
export const Select = hostElement<PropsSelect>("SELECT");
export const List = hostElement<PropsList>("LIST");
