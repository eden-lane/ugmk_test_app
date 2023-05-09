import React, { useEffect, useRef } from 'react';
import {
  axisBottom,
  axisLeft,
  groups,
  index,
  max,
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  select,
} from 'd3';
import { eachMonthOfInterval, endOfYear, format, startOfYear } from 'date-fns';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

type Props = {
  data: any;
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
const COLORS = ['tomato', 'lightblue'];

export const AllProductsChart = (props: Props) => {
  const { data, selectedProduct } = props;
  const canvasRef = useRef(null);
  const legendRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !canvasRef.current ||
      !xAxisRef.current ||
      !yAxisRef.current ||
      !legendRef.current ||
      !data
    ) {
      return;
    }

    const canvas = select(canvasRef.current);
    const legend = select(legendRef.current);
    const xAxisElement = select<SVGSVGElement, any>(xAxisRef.current);
    const yAxisElement = select<SVGSVGElement, any>(yAxisRef.current);

    const year = eachMonthOfInterval({
      start: startOfYear(new Date(2022, 1, 1)),
      end: endOfYear(new Date(2022, 1, 1)),
    }).map((date) => format(date, 'MMM'));

    const dataByMonth = groups(
      data.products,
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
                  prev += p.value;
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

    // console.log(data.products);
    const factories = groups(data.products, (p) => p.factoryId).map(
      (f) => getFactoryName(f[0])
    );

    const xScale = scaleBand()
      .domain(year)
      .range([MARGINS.left, WIDTH])
      .padding(0.2);
    const xInnerScale = scaleBand()
      .domain(factories) // TODO: Use real domain values
      .range([0, xScale.bandwidth()])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([maxProducts, 0])
      .range([MARGINS.bottom, HEIGHT - MARGINS.bottom]);

    const colorsScale = scaleOrdinal()
      .domain(factories) // TODO: Use real domain values
      .range(COLORS);

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
        return `translateX(${xScale(format(d.date, 'MMM')) || 0}px)`;
      })
      .selectAll('rect')
      .data((d) => {
        return d.factories;
      })
      .join('rect')
      .on('click', (_, d) => {
        navigate(`/details/${d.factoryId}/${d.date.getMonth() + 1}`)
      })
      .attr('x', (d) => {
        return xInnerScale(getFactoryName(d.factoryId)) || 0;
      })
      .attr('width', xInnerScale.bandwidth())
      .attr('height', (d) => yScale(d.products as number))
      .attr('y', (d) => {
        return HEIGHT - yScale(d.products as number) - MARGINS.bottom;
      })
      .attr('fill', (d) => {
        return colorsScale(getFactoryName(d.factoryId));
      });

    // legend.selectAll('');
  }, [data, selectedProduct]);

  return (
    <>
      <Canvas ref={canvasRef} width={WIDTH} height={HEIGHT}>
        <g className="container"></g>
        <g ref={xAxisRef} />
        <g ref={yAxisRef} />
      </Canvas>
      <Legend ref={legendRef} width={WIDTH} height={50} />
    </>
  );
};

const getFactoryName = (id: number) => `Фабрика #${id}`

const Canvas = styled.svg`
  & rect {
    cursor: pointer;
  }
`;

const Legend = styled.svg``;
