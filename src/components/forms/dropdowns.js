import { SchemaForm } from '../schema';

const { withOptions, Dropdown } = SchemaForm;

export const ItemType = withOptions(Dropdown, 'ItemType', 'name');
export const Item = withOptions(Dropdown, 'Item', 'name');
export const MenuItem = withOptions(Dropdown, 'MenuItem', 'name');
