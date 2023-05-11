import React, { useEffect, useRef } from 'react';
import {
  PieArcDatum,
  arc,
  pie,
  scaleOrdinal,
  schemeBlues,
  select
} from 'd3';
import styled from 'styled-components';

type Props = {
  data: Record<number, number>;
};

const HEIGHT = 250;
const WIDTH = 250;
const RADIUS = Math.min(HEIGHT, WIDTH) / 2;

export const ProductDetailsChart = (props: Props) => {
  const { data } = props;

  const canvasRef = useRef(null);

  const colorsScale = scaleOrdinal()
    .domain(Object.keys(data))
    .range(schemeBlues[Object.keys(data).length]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = select(canvasRef.current);

    const products = pie<[string, number]>().value((d) => {
      return d[1];
    })(Object.entries(data));

    canvas
      .select('.container')
      .style('transform', `translate(${WIDTH / 2}px, ${HEIGHT / 2}px)`)
      .selectAll('path')
      .data(products)
      .join('path')
      .attr('d', arc<PieArcDatum<[string, number]>>().innerRadius(0).outerRadius(RADIUS))
      .attr('fill', (d) => {
        return colorsScale(d.data[0]) as string;
      });
  }, [data]);

  return (
    <Root>
      <Canvas ref={canvasRef} width={WIDTH} height={HEIGHT}>
        <g className="container" />
      </Canvas>
      <Legend>
        {Object.keys(data).map((productName) => (
          <LegendLabel key={productName}>
            <Color color={colorsScale(productName) as string} />
            <span>{productName}</span>
          </LegendLabel>
        ))}
      </Legend>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const Canvas = styled.svg``;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LegendLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const Color = styled.span<{ color: string }>`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${(p) => p.color};
`;
