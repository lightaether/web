import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1 className="mb-4">Welcome to Battleship!</h1>
      <div className="d-flex flex-column align-items-center gap-3" style={{ maxWidth: '300px', margin: '0 auto' }}>
        <Button
          variant="primary"
          size="lg"
          className="w-100"
          onClick={() => navigate('/game/normal')}
        >
          Normal Game
        </Button>
        <Button
          variant="success"
          size="lg"
          className="w-100"
          onClick={() => navigate('/game/easy')}
        >
          Free Play Game
        </Button>
      </div>
    </Container>
  );
};

export default Home;