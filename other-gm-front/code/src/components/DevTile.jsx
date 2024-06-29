import PropTypes from 'prop-types';
export const DevTile = ({ id, name }) => {
  return (
    <div>
      <h3>{id} - {name}</h3>
    </div>
  )
}

DevTile.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};