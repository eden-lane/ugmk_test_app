import React, { useEffect, useMemo, useRef } from 'react';
import {
  axisBottom,
  axisLeft,
  groups,
  max,
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  select,
  schemeAccent,
} from 'd3';
import { eachMonthOfInterval, endOfYear, format, startOfYear } from 'date-fns';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Product } from '../products.types';
import { ru } from 'date-fns/locale';

type Props = {
  data: Product[];
  selectedProduct: 'all' | string;
};

const WIDTH = 600;
const HEIGHT = 250;
const MARGINS = {
  left: 50,
  top: 0,
  bottom: 20,
  right: 0,
};

export const AllProductsChart = (props: Props) => {
  const { data, selectedProduct } = props;
  const canvasRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  const navigate = useNavigate();

  const factories = useMemo(
    () =>
      data
        ? groups(data, (p) => p.factoryId).map((f) => getFactoryName(f[0]))
        : [],
    [data]
  );

  const colorsScale = scaleOrdinal().domain(factories).range(schemeAccent);

  useEffect(() => {
    if (!canvasRef.current || !xAxisRef.current || !yAxisRef.current || !data) {
      return;
    }

    const canvas = select(canvasRef.current);
    const xAxisElement = select<SVGSVGElement, any>(xAxisRef.current);
    const yAxisElement = select<SVGSVGElement, any>(yAxisRef.current);

    const year = eachMonthOfInterval({
      start: startOfYear(new Date(2022, 1, 1)),
      end: endOfYear(new Date(2022, 1, 1)),
    }).map((date) => format(date, 'MMM', { locale: ru }));

    const dataByMonth = groups(
      data,
      (d) => {
        const date = new Date(d.date);

        return new Date(date.getFullYear(), date.getMonth());
      },
      (d) => {
        return d.factoryId;
      }
    );

    const result = dataByMonth.map(([date, factories]) => {
      return {
        date,
        factories: factories.map(([id, prodcuts]) => {
          return {
            date,
            factoryId: id,
            products: prodcuts.reduce((prev, current) => {
              current.products
                .filter((p) => {
                  if (selectedProduct === 'all') {
                    return true;
                  }

                  return p.id === selectedProduct;
                })
                .forEach((p) => {
                  prev += p.value / 1000;
                });

              return prev;
            }, 0 as number),
          };
        }),
      };
    });

    const maxProducts = max(result, (d) => {
      return max(d.factories, (f) => {
        return f.products;
      });
    }) as unknown as number;

    console.log(result);
    console.log(maxProducts);

    const xScale = scaleBand()
      .domain(year)
      .range([MARGINS.left, WIDTH])
      .padding(0.2);
    const xInnerScale = scaleBand()
      .domain(factories)
      .range([0, xScale.bandwidth()])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([0, maxProducts])
      .range([HEIGHT - MARGINS.bottom, MARGINS.bottom]);

    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale);

    xAxisElement
      .style('transform', `translateY(${HEIGHT - MARGINS.bottom}px)`)
      .call(xAxis);
    yAxisElement
      .style('transform', `translateX(${MARGINS.left}px)`)
      .call(yAxis);

    canvas
      .select('.container')
      .selectAll('g')
      .data(result)
      .join('g')
      .style('transform', (d) => {
        return `translateX(${
          xScale(format(d.date, 'MMM', { locale: ru })) || 0
        }px)`;
      })
      .selectAll('rect')
      .data((d) => {
        return d.factories;
      })
      .join('rect')
      .on('click', (_, d) => {
        navigate(`/details/${d.factoryId}/${d.date.getMonth() + 1}`);
      })
      .attr('x', (d) => {
        return xInnerScale(getFactoryName(d.factoryId)) || 0;
      })
      .attr('width', xInnerScale.bandwidth())
      .attr('height', (d) => {
        return HEIGHT - yScale(d.products as number) - MARGINS.bottom;
      })
      .attr('y', (d) => {
        return yScale(d.products as number);
      })
      .attr('fill', (d) => {
        return colorsScale(getFactoryName(d.factoryId)) as string;
      });
  }, [data, selectedProduct]);

  return (
    <Root>
      <Canvas ref={canvasRef} width={WIDTH} height={HEIGHT}>
        <g className="container"></g>
        <g ref={xAxisRef} />
        <g ref={yAxisRef} />
      </Canvas>
      <Legend>
        {factories.map((f) => (
          <LegendLabel key={f}>
            <Color color={colorsScale(f) as string} />
            <span>{f}</span>
          </LegendLabel>
        ))}
      </Legend>
    </Root>
  );
};

const getFactoryName = (id: number) => `Фабрика #${id}`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const Canvas = styled.svg`
  & rect {
    cursor: pointer;
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 8px;
  width: ${WIDTH}px;
  height: 50px;
  justify-content: center;
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
