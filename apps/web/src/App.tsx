/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useFetch } from "use-http";
import { WidgetProps } from "./types";
import Form from "./components/Form";
import WidgetsList from "./components/WidgetsList";

const { REACT_APP_SERVER_URL, REACT_APP_EXECUTION_ENVIRONMENT } = process.env;

// in this small app, App.tsx file becomes a logic or container file that
// feeds data into the components and handles interaction with the API
function App() {
  const [widgets, setWidgets] = useState<WidgetProps[]>([]);
  const { get, post, put, del, response, loading, error } = useFetch(`${REACT_APP_SERVER_URL}/${REACT_APP_EXECUTION_ENVIRONMENT}`);

  useEffect(() => { 
    async function loadWidgets() {
      const initialWidgets = await get('/get-widgets');
      if (response.ok) setWidgets(initialWidgets);
    }
    loadWidgets();
   }, []);

  async function deleteWidget(id: string) {
    await del(`/delete-widget/${id}`);
    if (response.ok) {
      const remainingWidgets = widgets.filter((widget) => id !== widget.id);
      setWidgets(remainingWidgets);
    }
  }

  async function editWidget(id: string, newName: string, newManufacturer: string, newStockLevel: number) {
    const targetWidget = widgets.find((widget) => id === widget.id);
    if (targetWidget) {
      const editedWidget = await put(`/update-widget/${targetWidget.id}`, { name: newName, manufacturer: newManufacturer, stockLevel: newStockLevel });
      if (response.ok) {
        const editedWidgetList = widgets.map((widget) => {
          if (id === widget.id) {
            return { ...widget, ...editedWidget };
          }
          return widget;
        });
        setWidgets(editedWidgetList);
      }
    }
  }

  async function addWidget(name: string, manufacturer: string, stockLevel: number) {
    const newWidget = await post('/create-widget', { id: `widget-${nanoid()}`, name, manufacturer, stockLevel })
    if (response.ok) setWidgets([...widgets, newWidget]);
  }

  return (
    <div className="widgetapp stack-large">
      <Form data-testid="widget-form" addWidget={addWidget} />
      {error && 'Error!'}
      {loading && 'Loading...'}
      <WidgetsList widgets={widgets} deleteWidget={deleteWidget} editWidget={editWidget} />
    </div>
  );
}

export default App;
