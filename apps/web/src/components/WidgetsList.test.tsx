/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen, fireEvent } from "@testing-library/react";
import WidgetsList from "./WidgetsList";

const mockWidgets = [
  {
    id: "123",
    name: "Test Widget 1",
    manufacturer: "Test Manufacturer 1",
    stockLevel: 10,
  },
  {
    id: "456",
    name: "Test Widget 2",
    manufacturer: "Test Manufacturer 2",
    stockLevel: 5,
  },
];

describe("WidgetsList", () => {
  it("should render a list of widgets", () => {
    render(
      <WidgetsList
        deleteWidget={() => { }}
        editWidget={() => { }}
        widgets={mockWidgets}
      />
    );

    const widgetItems = screen.getAllByRole("listitem");
    expect(widgetItems).toHaveLength(mockWidgets.length);

    widgetItems.forEach((widgetItem, index) => {
      const widget = mockWidgets[index];
      expect(widgetItem).toHaveTextContent(widget.name);
      expect(widgetItem).toHaveTextContent(widget.manufacturer);
      expect(widgetItem).toHaveTextContent(widget.stockLevel.toString());
    });
  });

  it("should render the correct heading text", () => {
    render(
      <WidgetsList
        deleteWidget={() => { }}
        editWidget={() => { }}
        widgets={mockWidgets}
      />
    );

    const widgetsNoun = mockWidgets.length !== 1 ? "widgets" : "widget";
    const headingText = `${mockWidgets.length} ${widgetsNoun} remaining`;
    const heading = screen.getByRole("heading", { name: headingText });

    expect(heading).toBeInTheDocument();
  });

  it("should call deleteWidget when a widget is deleted", () => {
    const mockDeleteWidget = jest.fn();

    render(
      <WidgetsList
        deleteWidget={mockDeleteWidget}
        editWidget={() => { }}
        widgets={mockWidgets}
      />
    );

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });

    deleteButtons.forEach((deleteButton, index) => {
      fireEvent.click(deleteButton);
      expect(mockDeleteWidget).toHaveBeenCalledWith(mockWidgets[index].id);
    });
  });
});
