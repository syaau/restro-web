import React from 'react';
import { connect } from 'react-redux';
import Header from './../components/Header';
import Footer from './../components/Footer';
import MainAdminSetion from './../components/MainAdminSection';
import AdminLogin from './../components/AminLogin';

const Home = ({ session }) => {
  return (
    <div className="wrapper">
      <Header />
      { typeof session !== 'string' ? <AdminLogin error={session} /> : <MainAdminSetion /> }
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  session:  state.session
})
export default connect(mapStateToProps)(Home);
