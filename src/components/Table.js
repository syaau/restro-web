import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { Icon } from 'semantic-ui-react';
import updateCurrentTableId from './../actions/updateCuurentTableId';
import ItemTypes from './ItemTypes';
import { connect } from 'react-redux';

const style = {
  position: 'absolute',
  width: 100,
  height: 80,
  rotate: 90,
  color: 'black',
  border: '1px dashed gray',
  backgroundColor: 'white',
//  padding: '0.5rem 1rem',
  cursor: 'move',
};

const tableSource = {
  beginDrag(props) {
    const { id, left, top } = props;
    return { id, left, top };
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
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
      hideSourceOnDrag: PropTypes.bool.isRequired,
      children: PropTypes.node,
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
        rotationAngle,
        connectDragSource,
        isDragging,
        children,
      } = this.props;
      console.log('roatation angle form from proops', JSON.stringify({ rotationAngle }));
      if (isDragging && hideSourceOnDrag) {
        return null;
      }

      return connectDragSource(<div
        id="table"
        style={{ ...style, left, top, backgroundColor: this.state.colorBackground ? 'red' : '#fff', transform: `rotate(${rotationAngle}deg)` }}>
        <Icon
          size="big"
          link
          name="table"
          onClick={() => { this.props.updateCurrentTableId(id); this.changeBackGroundColor()}}
        />
        <h3>No: {id}</h3>
        {children}
        </div>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    currentTableId: state.currentTableId,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateCurrentTableId: id => dispatch(updateCurrentTableId(id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DragSource(ItemTypes.TABLE, tableSource, collect)(TableObj));
