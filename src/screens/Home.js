import React from 'react';
import { connect } from 'react-redux';
import Header from './../components/Header';
import Footer from './../components/Footer';
import MainAdminSetion from './../components/MainAdminSection';
import AdminLogin from './../components/AminLogin';
import PropTypes from 'prop-types';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';

const Home = ({ session },  context) => {
  return (
    <div>
      {typeof session !== 'string' ? <AdminLogin error={session} /> : <MainAdminSetion /> }
    </div>
  );
};

// Home.contextTypes = {
//   api: PropTypes.object.isRequired,
// };
const mapStateToProps = state => ({
  session: state.session,
});
export default connect(mapStateToProps)(Home);
