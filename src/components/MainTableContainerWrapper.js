import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TableContainer from './TableContainer';

const MainTableContainerWrapper = () => {
  return (
    <TableContainer />
  );
};
export default DragDropContext(HTML5Backend)(MainTableContainerWrapper);