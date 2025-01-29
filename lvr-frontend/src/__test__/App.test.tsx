import { render, fireEvent, screen } from "@testing-library/react";
import App from "../App";

jest.mock("use-debounce", () => {
  return {
    useDebouncedCallback: jest.fn().mockImplementation((callback) => callback),
  };
});

describe("App", () => {
  it("render App correctly and user can input valid values", () => {
    const { getByText } = render(<App />);
    expect(getByText("LVR Calculator")).toBeInTheDocument();
    expect(
      getByText("Please fill in the form and calculate Loan to Value Ratio.")
    ).toBeInTheDocument();

    //estimated property value
    fireEvent.input(
      screen.getByPlaceholderText("* Enter Estimated Property Value"),
      {
        target: {
          value: 100000,
        },
      }
    );
    //estimated loan value
    fireEvent.input(
      screen.getByPlaceholderText("* Enter Estimated Loan Value"),
      {
        target: {
          value: 80000,
        },
      }
    );
    //estimated cash out value
    fireEvent.input(screen.getByPlaceholderText("* Enter Cash Out Amount"), {
      target: {
        value: 70000,
      },
    });
    //Property Valuation Evidence
    const evidence = screen.queryByPlaceholderText(
      "Property Valuation Evidence"
    );
    expect(evidence).not.toBeInTheDocument();

    //Property Valuation (Physical)
    fireEvent.input(
      screen.getByPlaceholderText("* Enter Property Valuation (Physical)"),
      {
        target: {
          value: 90000,
        },
      }
    );

    expect(
      screen.getByPlaceholderText("* Enter Estimated Property Value")
    ).toHaveValue(100000);
    expect(
      screen.getByPlaceholderText("* Enter Estimated Loan Value")
    ).toHaveValue(80000);
    expect(screen.getByPlaceholderText("* Enter Cash Out Amount")).toHaveValue(
      70000
    );
    expect(
      screen.getByPlaceholderText("* Enter Property Valuation (Physical)")
    ).toHaveValue(90000);
    expect(
      screen.getByPlaceholderText("Property Valuation Evidence")
    ).toBeInTheDocument();

    // screen.debug();
  });
});
