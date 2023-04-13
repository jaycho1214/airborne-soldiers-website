import { CSSProperties, DetailedHTMLProps, InputHTMLAttributes } from 'react';

export interface FormSubmitButtonProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export default function FormSubmitButton({
  style,
  className,
  ...rest
}: FormSubmitButtonProps) {
  return (
    <input
      {...rest}
      type='submit'
      style={Object.assign(defaultStyle, style)}
      className={`px-10 py-3 font-bold ${className}`}
    />
  );
}

const defaultStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  alignSelf: 'center',
  color: '#000000',
  borderRadius: 10,
};
