export default function getRecord(state, { schema, id }) {
  const records = state.schema[schema];
  return records.find(r => r.id === id);
}
