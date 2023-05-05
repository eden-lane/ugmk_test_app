import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { select } from 'd3';

type Props = {
  data: any;
}

export const AllProductsChart = (props: Props) => {
  const { data } = props;
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    
    // const canvas = select(canvasRef.current);
    console.log(data);
  }, [data]);

  return (
    <Canvas ref={canvasRef} width={400} height={150}>
      test
    </Canvas>
  )

}

const Canvas = styled.svg`
  
`;