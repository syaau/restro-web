import React from 'react';
import { connect } from 'react-redux';
import CurrentOrderShow from './CurrentOrderShow';
import ItemStockWatchComponent from './ItemStockWatch';
import MainTableContainerWrapper from './MainTableContainerWrapper';


const MainAdminSection = () => (
  <div className="wrapper">
    <div className="order-stock-wrapper">
      <div className="customer-order-show">
        <CurrentOrderShow />
      </div>
      <div className="customer-order-show">
        <ItemStockWatchComponent />
      </div>
    </div>
    <MainTableContainerWrapper />
  </div>
);

const mapUserStatToProps = (state) => {
  return {
    userinfo: state.session,
  };
};

export default connect(mapUserStatToProps)(MainAdminSection);