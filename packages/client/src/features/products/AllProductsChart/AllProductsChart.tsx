import React, { useEffect, useRef } from 'react';
import {
  axisBottom,
  axisLeft,
  groups,
  max,
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  select,
} from 'd3';
import { eachMonthOfInterval, endOfYear, format, startOfYear } from 'date-fns';
import styled from 'styled-components';

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

export const AllProductsChart = (props: Props) => {
  const { data, selectedProduct } = props;
  const canvasRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

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
            factoryId: id,
            products: prodcuts.reduce((prev, current) => {
              console.log(selectedProduct);
              
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

    const xScale = scaleBand()
      .domain(year)
      .range([MARGINS.left, WIDTH])
      .padding(0.2);
    const xInnerScale = scaleBand()
      .domain(['1', '2'])
      .range([0, xScale.bandwidth()])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([maxProducts, 0])
      .range([MARGINS.bottom, HEIGHT - MARGINS.bottom]);

    const colorsScale = scaleOrdinal()
      .domain(['1', '2'])
      .range(['tomato', 'lightblue']);

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
      .attr('x', (d) => {
        return xInnerScale(d.factoryId.toString()) || 0;
      })
      .attr('width', xInnerScale.bandwidth())
      .attr('height', (d) => yScale(d.products as number))
      .attr('y', (d) => {
        return HEIGHT - yScale(d.products as number) - MARGINS.bottom;
      })
      .attr('fill', (d) => {
        return colorsScale(d.factoryId.toString());
      });
  }, [data, selectedProduct]);

  return (
    <Canvas ref={canvasRef} width={WIDTH} height={HEIGHT}>
      <g className="container"></g>
      <g ref={xAxisRef} />
      <g ref={yAxisRef} />
    </Canvas>
  );
};

const Canvas = styled.svg``;
