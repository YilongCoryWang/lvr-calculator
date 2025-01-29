import { render, screen } from "@testing-library/react";
import Input from "../Input";
import {
  FieldErrors,
  FieldValues,
  UseFormRegisterReturn,
} from "react-hook-form";

describe("Input", () => {
  it("renders the Input component", () => {
    const errors: FieldErrors<FieldValues> = {};

    const id = "mock-id";
    const type = "number";
    const label = "mock-label";
    const options = {} as UseFormRegisterReturn<"estPropVal">;
    const placeholder = "mock-placeholder";
    const onChangeHandler = jest.fn();

    render(
      <Input
        id={id}
        type={type}
        label={label}
        options={options}
        placeholder={placeholder}
        errors={errors}
        onChangeHandler={onChangeHandler}
      />
    );

    expect(screen.queryByLabelText("mock-label")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("mock-placeholder")
    ).toBeInTheDocument();
  });
});
