/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import { useRef, useEffect } from "react";
import { WidgetsListProps } from "../types";
import WidgetItem from "./WidgetItem";
import usePrevious from "../hooks/usePrevious";

const WidgetsList: React.FC<WidgetsListProps> = ({ widgets, deleteWidget, editWidget }) => {
  const widgetList = widgets.map((widget) => (
    <WidgetItem
      id={widget.id}
      name={widget.name}
      manufacturer={widget.manufacturer}
      stockLevel={widget.stockLevel}
      key={widget.id}
      deleteWidget={deleteWidget}
      editWidget={editWidget}
    />
  ));

  const widgetsNoun = widgetList.length !== 1 ? "widgets" : "widget";
  const headingText = `${widgetList.length} ${widgetsNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevWidgetLength = usePrevious(widgets.length);

  useEffect(() => {
    if (prevWidgetLength && widgets.length - prevWidgetLength === -1) {
      (listHeadingRef.current as HTMLElement | null)?.focus();
    }
  }, [widgets.length, prevWidgetLength]);

  return (
    <div className="widget-list stack-large stack-exception">
      <h2 id="list-heading" tabIndex={-1} ref={listHeadingRef}>
        {headingText}
      </h2>
      {widgetList}
    </div>
  );
};

export default WidgetsList;
