import React from 'react';
import { connect } from 'react-redux';
import CurrentOrderShow from './CurrentOrderShow';
import ItemStockWatchComponent from './ItemStockWatch';
import MainTableContainerWrapper from './MainTableContainerWrapper';


const MainAdminSection = () => (
  <div>
    <div className="wrapper">
      <div className="order-stock-wrapper">
        <CurrentOrderShow />
      </div>
      <div className="customer-order-show">
        <ItemStockWatchComponent />
      </div>
    </div>
    <div className="main-table-container">
      <MainTableContainerWrapper />
    </div>
  </div>
);

const mapUserStatToProps = (state) => {
  return {
    userinfo: state.session,
  };
};

export default connect(mapUserStatToProps)(MainAdminSection);