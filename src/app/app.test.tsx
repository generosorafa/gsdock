import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./app";

describe("GSDock", () => {
  it("abre o dashboard e navega para a separação", async () => {
    render(<App />);

    expect(await screen.findByRole("heading", { name: "Bom dia, Rafael." })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "Separação" })[0]);

    expect(await screen.findByRole("heading", { name: "Separação do dia" })).toBeInTheDocument();
    expect(screen.getByText("27 unidades confirmadas", { exact: false })).toBeInTheDocument();
  });

  it("exibe estados vazio e de erro com recuperação", async () => {
    render(<App />);
    await screen.findByRole("heading", { name: "Bom dia, Rafael." });

    fireEvent.change(screen.getByLabelText("Estado dos dados no protótipo"), {
      target: { value: "empty" },
    });
    expect(
      screen.getByRole("heading", { name: "Nada para mostrar neste período" }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Estado dos dados no protótipo"), {
      target: { value: "error" },
    });
    expect(screen.getByRole("button", { name: "Tentar novamente" })).toBeInTheDocument();
  });
});
