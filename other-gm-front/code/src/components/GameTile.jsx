import PropTypes from 'prop-types';
export const GameTile = ({ id, name }) => {
  return (
    <div className='header-card'>
      <h3 style={{ overflowX: 'hidden' }}>{id} - {name}</h3>
    </div>
  )
}

GameTile.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};