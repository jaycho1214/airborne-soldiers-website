import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from 'react';

export interface TextInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ ...rest }, ref) => {
    return (
      <input
        {...rest}
        ref={ref}
        className='p-5'
        style={{ backgroundColor: '#1C1C1C', borderRadius: 15 }}
      />
    );
  },
);
TextInput.displayName = 'TextInput';

export default TextInput;
