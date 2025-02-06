import { ErrorMessage } from "@hookform/error-message";
import {
  FieldErrors,
  FieldValues,
  UseFormRegisterReturn,
} from "react-hook-form";

type InputProps = {
  id: string;
  type: "number" | "file";
  label: string;
  options: UseFormRegisterReturn;
  placeholder: string;
  errors: FieldErrors<FieldValues>;
};

function Input({ id, type, label, options, placeholder, errors }: InputProps) {
  console.log("errors", errors);
  return (
    <div>
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <input
        {...options}
        type={type}
        className="w-full p-3 border border-gray-300 rounded-md placeholder:font-sans placeholder:font-light bg-white"
        placeholder={placeholder}
        id={id}
      />
      <ErrorMessage
        errors={errors}
        name={id}
        render={({ message }: { message: string }) => (
          <p className="text-red-600">{message}</p>
        )}
      />
    </div>
  );
}

export default Input;
