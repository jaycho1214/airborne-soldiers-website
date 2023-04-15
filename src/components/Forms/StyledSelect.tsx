import Select, { Props } from 'react-select';

export interface StyledSelectProps extends Props {}

export default function StyledSelect({ styles, ...rest }: StyledSelectProps) {
  return (
    <Select
      {...rest}
      styles={{
        ...styles,
        control(base, props) {
          return {
            ...base,
            backgroundColor: '#1C1C1C',
            color: '#FFFFFF',
          };
        },
        singleValue(base, props) {
          return {
            ...base,
            backgroundColor: '#1C1C1C',
            color: '#FFFFFF',
          };
        },
        menu(base, props) {
          return {
            ...base,
            backgroundColor: '#1C1C1C',
            color: '#FFFFFF',
          };
        },
      }}
    />
  );
}
