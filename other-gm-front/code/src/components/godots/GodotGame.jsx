const GodotGame = ({ gameUrl }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            margin: 0,
            padding: 0
        }}>
            <div style={{ width: '1024px', height: '768px', overflow: 'hidden', margin: 'auto', padding: 0 }}>
                <iframe
                    src={gameUrl}
                    style={{ width: '100%', height: '100%', border: 'none', margin: 0, padding: 0 }}
                    title="Godot Game"
                    frameBorder="0"
                    scrolling="no"
                ></iframe>
            </div>
        </div>
    );
};

export default GodotGame;
