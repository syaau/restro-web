import { connect } from 'react-redux';

export default function withOptions(Component, schema, field) {
  const mapStateToProps = state => ({
    options: state.schema[schema].map(record => ({
      value: record.id,
      text: typeof field === 'function' ? field(record) : record[field],
    })),
  });

  const mapDispatchToProps = () => ({});

  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
