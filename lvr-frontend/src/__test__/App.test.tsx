import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders the Input component", () => {
    const { getByText } = render(<App />);
    expect(getByText("LVR Calculator")).toBeInTheDocument();
    expect(
      getByText("Please fill in the form and calculate Loan to Value Ratio.")
    ).toBeInTheDocument();

    screen.debug();
  });
});
