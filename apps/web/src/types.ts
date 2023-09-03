export interface WidgetProps {
    id: string;
    name: string;
    manufacturer: string;
    stockLevel: number;
}

export interface ModifyWidgetProps {
    deleteWidget: (id: string) => void;
    editWidget: (id: string, newName: string, newManufacturer: string, newStockLevel: number) => void;
}

export interface AddWidgetProps {
    addWidget: (name: string, manufacturer: string, stockLevel: number) => void;
};

export interface WidgetsListProps extends ModifyWidgetProps {
    widgets: WidgetProps[];
}
