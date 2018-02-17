import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { Icon } from 'semantic-ui-react';
import ItemTypes from './ItemTypes';


const style = {
  position: 'absolute',
  width: 100,
  height: 80,
  rotate: 90,
  color: 'black',
  border: '1px dashed gray',
  backgroundColor: 'white',
  cursor: 'move',
};

const tableSource = {
  beginDrag(props) {
    const { id, left, top } = props;
    return { id, left, top };
  },
};

function collect(connectprops, monitor) {
  return {
    connectDragSource: connectprops.dragSource(),
    isDragging: monitor.isDragging(),
  };
}


class TableObj extends Component {

    static propTypes = {
      connectDragSource: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired,
      left: PropTypes.number.isRequired,
      top: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      hideSourceOnDrag: PropTypes.bool.isRequired,
      children: PropTypes.node.isRequired,
      rotationAngle: PropTypes.number.isRequired,
      currentTableId: PropTypes.func.isRequired,
    }
    state = {
      colorBackground: false,
    }

    changeBackGroundColor() {
      this.setState({
        colorBackground: !this.state.colorBackground,
      });
    }

    render() {
      const {
        hideSourceOnDrag,
        left,
        top,
        id,
        name,
        rotationAngle,
        connectDragSource,
        isDragging,
        children,
      } = this.props;
      if (isDragging && hideSourceOnDrag) {
        return null;
      }

      return connectDragSource(
        <div
          id="table"
          style={{
            ...style,
            left,
            top,
            backgroundColor: this.state.colorBackground ? 'blue' : '#fff',
            transform: `rotate(${rotationAngle}deg)`,
            }}>
          <Icon
            size="big"
            link
            name="table"
            onClick={() => { this.props.currentTableId(id); this.changeBackGroundColor(); }}
          />
          <h5>{ name }</h5>
          {children}
        </div>);
    }
}


export default DragSource(ItemTypes.TABLE, tableSource, collect)(TableObj);
