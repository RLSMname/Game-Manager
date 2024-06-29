import PropTypes from 'prop-types';
export const GameCard = ({ name, description, developer, price }) => {
  return (
    <div className='wrapper-card' style={{ width: 'max-content' }}>
      <div style={{ overflow: 'visible' }} className='img-wrapper-tile'>
        <img src="https://static.vecteezy.com/system/resources/previews/010/807/101/non_2x/game-control-pixel-art-free-vector.jpg"></img>
      </div>
      <div className='content-card'>
        <h3>{name}</h3>
        <h4><em>Developer:</em>{developer}</h4>
        <h4><em>Price:</em>{price}</h4>
        <h5>{description}</h5>
      </div>
    </div>
  )
}

GameCard.propTypes = {
  name: PropTypes.string.isRequired,
  developer: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};