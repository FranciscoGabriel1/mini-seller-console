import { render, screen } from "@testing-library/react"
import App from "../../App"

describe("App", () => {
  it("renderiza o header", () => {
    render(<App />)
    expect(screen.getByText(/Mini Seller Console/i)).toBeInTheDocument()
  })
})
